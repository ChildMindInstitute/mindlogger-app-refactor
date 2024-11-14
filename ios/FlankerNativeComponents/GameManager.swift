//
//  GameManager.swift
//  MDCApp
//
//  Created by Volodymyr Nazarkevych on 21.05.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import UIKit

enum SelectedButton {
  case left
  case right
}

enum Constants {
  static let lowTimeInterval: TimeInterval = 0.5
  static let moreTimeInterval: TimeInterval = 3
  static let blueColor: UIColor = UIColor(red: 37, green: 95, blue: 158)
  static let greenColor: UIColor = UIColor(red: 68, green: 133, blue: 87)
  static let redColor: UIColor = UIColor(red: 199, green: 20, blue: 20)
  static let correctText: String = "Correct!"
  static let inCorrectText: String = "Incorrect"
  static let timeRespondText: String = "Respond faster"
  static let bigFont: UIFont = .systemFont(ofSize: 50.0, weight: .bold)
  static let smallFont: UIFont = .systemFont(ofSize: 30.0, weight: .bold)
  static let tag: String = "trial"
}

enum TypeTimeStamps {
  case fixations
  case trial
  case feedback
  case response
}

protocol GameManagerProtocol: AnyObject {
  func updateText(text: String, color: UIColor, font: UIFont, isStart: Bool, typeTime: TypeTimeStamps)
  func updateFixations(image: URL?, isStart: Bool, typeTime: TypeTimeStamps)
  func updateTime(time: String)
  func setEnableButton(isEnable: Bool)
  func updateTitleButton(left: String?, right: String?, leftImage: URL?, rightImage: URL?, countButton: Int)
  func resultTest(avrgTime: Int?, procentCorrect: Int?, data: FlankerModel?, dataArray: [FlankerModel]?, isShowResults: Bool, minAccuracy: Int)
}

class GameManager {
  private let resultManager = ResultManager.shared

  private var text: String = ""
  private var responseText: String = ""

  private var timerSetText: Timer?
  private var timeResponse: Timer?

  private var countTest = -1
  private var countAllGame = 0
  private var correctAnswers = 0

  private var timeSpeedGame: TimeInterval = 0.5
  private var isShowFeedback = true
  private var isShowFixations = true
  private var isShowResults = true
  private var arrayTimes: [Int] = []

  private var startFixationsTimestamp: Double?
  private var endFixationsTimestamp: Double?
  private var startTrialTimestamp: Double?
  private var endTrialTimestamp: Double?
  private var startFeedbackTimestamp: Double?
  private var endFeedbackTimestamp: Double?
  private var respondTouchButton: Double?

  private var hasRespondedInCurrentTrial = false

  private var gameParameters: ParameterModel?

  weak var delegate: GameManagerProtocol?

  func startGame(timeSpeed: Float, isShowAnswers: Bool, countGame: Int) {
    countAllGame = countGame
    timeSpeedGame = TimeInterval(timeSpeed)
    isShowFeedback = isShowAnswers
    startLogicTimer()
  }

  func parameterGame() {
    guard let parameters = ParameterGameManager.shared.getParameters() else { return }
    gameParameters = parameters
    isShowFeedback = parameters.showFeedback
    isShowFixations = parameters.showFixation
    isShowResults = parameters.showResults
    countAllGame = parameters.trials.count
    resultManager.cleanData()
    countTest = -1
    correctAnswers = 0
    arrayTimes = []
    startLogicTimer()
  }

  func startLogicTimer() {
    invalidateTimers()
    setDefaultText(isFirst: true)
  }

  func setEndTimeViewingImage(time: Double, isStart: Bool, type: TypeTimeStamps) {
    if isStart {
      switch type {
      case .fixations:
        startFixationsTimestamp = time
      case .trial:
          break
      case .feedback:
        startFeedbackTimestamp = time
      case .response:
        break
      }
    } else {
      switch type {
      case .fixations:
        endFixationsTimestamp = time
      case .trial:
        endTrialTimestamp = time
      case .feedback:
        endFeedbackTimestamp = time
      case .response:
        break
      }
    }
  }

  func checkedAnswer(button: SelectedButton) {
    guard !hasRespondedInCurrentTrial else { return }
    hasRespondedInCurrentTrial = true
    respondTouchButton = CACurrentMediaTime()
    invalidateTimers()

    delegate?.setEnableButton(isEnable: false)

    guard let gameParameters = gameParameters else { return }
    guard let startTrialTimestamp = startTrialTimestamp else { return }
    var resultTime = (respondTouchButton! - startTrialTimestamp) * 1000

    arrayTimes.append(Int(resultTime))
    delegate?.updateTime(time: String(format: "%.3f", resultTime))

    endTrialTimestamp = respondTouchButton
    setEndTimeViewingImage(time: endTrialTimestamp!, isStart: false, type: .trial)

    startFeedbackTimestamp = CACurrentMediaTime()
    setEndTimeViewingImage(time: startFeedbackTimestamp!, isStart: true, type: .feedback)

    let correctChoice = gameParameters.trials[countTest].correctChoice
    let isCorrect = (button == .left && correctChoice == 0) || (button == .right && correctChoice == 1)
    if isCorrect {
        correctAnswers += 1
    }

    let buttonPressed = (button == .left) ? "0" : "1"
    let model = FlankerModel(rt: resultTime,
                             stimulus: text,
                             button_pressed: buttonPressed,
                             image_time: endTrialTimestamp! * 1000,
                             correct: isCorrect,
                             start_timestamp: 0,
                             tag: Constants.tag,
                             trial_index: countTest + 1,
                             start_time: startTrialTimestamp * 1000,
                             response_touch_timestamp: respondTouchButton! * 1000)

    resultManager.addStepData(data: model)
    delegate?.resultTest(avrgTime: nil, procentCorrect: nil, data: model, dataArray: nil, isShowResults: false, minAccuracy: gameParameters.minimumAccuracy)

    if gameParameters.showFeedback {
      let feedbackText = isCorrect ? Constants.correctText : Constants.inCorrectText
      let feedbackColor = isCorrect ? Constants.greenColor : Constants.redColor
      delegate?.updateText(text: feedbackText, color: feedbackColor, font: Constants.smallFont, isStart: false, typeTime: .feedback)
      let timer = Timer(timeInterval: Constants.lowTimeInterval, target: self, selector: #selector(setDefaultText), userInfo: nil, repeats: false)
      RunLoop.main.add(timer, forMode: .common)
    } else {
      setDefaultText(isFirst: false)
    }
  }

  @objc func setDefaultText(isFirst: Bool) {
    guard let gameParameters = gameParameters else { return }

    hasRespondedInCurrentTrial = false
    delegate?.setEnableButton(isEnable: false)

    if !isFirst {
      endFeedbackTimestamp = CACurrentMediaTime()
      setEndTimeViewingImage(time: endFeedbackTimestamp!, isStart: false, type: .feedback)
      countTest += 1
    } else {
      countTest = 0
    }

    if isEndGame() {
      handleEndOfGame()
      return
    }

    updateButtonTitle()

    if gameParameters.showFixation {
      setEndTimeViewingImage(time: CACurrentMediaTime(), isStart: true, type: .fixations)

      if let image = URL(string: gameParameters.fixation), gameParameters.fixation.contains("https") {
        delegate?.updateFixations(image: image, isStart: true, typeTime: .fixations)
      } else {
        delegate?.updateText(text: gameParameters.fixation, color: .black, font: Constants.bigFont, isStart: true, typeTime: .fixations)
      }
      timerSetText = Timer(timeInterval: gameParameters.fixationDuration / 1000, target: self, selector: #selector(setText), userInfo: nil, repeats: false)
      RunLoop.main.add(timerSetText!, forMode: .common)
    } else {
      setText()
    }
  }

  @objc func setText() {
    guard let gameParameters = gameParameters else { return }
    guard countTest < gameParameters.trials.count else {
        handleEndOfGame()
        return
    }

    setEndTimeViewingImage(time: CACurrentMediaTime(), isStart: false, type: .fixations)

    startTrialTimestamp = CACurrentMediaTime()

    text = gameParameters.trials[countTest].stimulus.en

    if let image = URL(string: text), text.contains("https") {
      delegate?.updateFixations(image: image, isStart: true, typeTime: .trial)
    } else {
      delegate?.updateText(text: text, color: .black, font: Constants.bigFont, isStart: true, typeTime: .trial)
    }

    DispatchQueue.main.asyncAfter(deadline: .now()) {
      self.delegate?.setEnableButton(isEnable: true)
      self.timeResponse = Timer(timeInterval: gameParameters.trialDuration / 1000, target: self, selector: #selector(self.timeResponseFailed), userInfo: nil, repeats: false)
      RunLoop.main.add(self.timeResponse!, forMode: .common)
    }
  }

  @objc func timeResponseFailed() {
    guard let gameParameters = gameParameters else { return }

    delegate?.setEnableButton(isEnable: false)

    endTrialTimestamp = CACurrentMediaTime()

    startFeedbackTimestamp = CACurrentMediaTime()

    if gameParameters.showFeedback {
      delegate?.updateText(text: Constants.timeRespondText, color: .black, font: Constants.smallFont, isStart: false, typeTime: .feedback)
    }

    guard let startTrialTimestamp = startTrialTimestamp else { return }

    let model = FlankerModel(rt: 0.0,
                             stimulus: text,
                             button_pressed: nil,
                             image_time: endTrialTimestamp! * 1000, // має намалювати
                             correct: false,
                             start_timestamp: 0, // вже намальовано
                             tag: Constants.tag,
                             trial_index: countTest + 1,
                             start_time: startTrialTimestamp * 1000,
                             response_touch_timestamp: 0)

    resultManager.addStepData(data: model)
    delegate?.resultTest(avrgTime: nil, procentCorrect: nil, data: model, dataArray: nil,isShowResults: gameParameters.showResults, minAccuracy: gameParameters.minimumAccuracy)

    if gameParameters.showFeedback {
      let timer = Timer(timeInterval: Constants.lowTimeInterval, target: self, selector: #selector(setDefaultText), userInfo: nil, repeats: false)
      RunLoop.main.add(timer, forMode: .common)
    } else {
      setDefaultText(isFirst: false)
    }
  }

  func handleEndOfGame() {
    guard let gameParameters = gameParameters else { return }

    let sumArray = arrayTimes.reduce(0, +)
    let avrgArray = arrayTimes.count > 0 ? sumArray / arrayTimes.count : 0
    let procentsCorrect = Float(correctAnswers) / Float(countAllGame) * 100

    clearData()

    delegate?.setEnableButton(isEnable: false)

    delegate?.resultTest(
      avrgTime: avrgArray,
      procentCorrect: Int(procentsCorrect),
      data: nil,
      dataArray: resultManager.oneGameDataResult,
      isShowResults: gameParameters.showResults,
      minAccuracy: gameParameters.minimumAccuracy
    )
  }

  func isEndGame() -> Bool {
    guard let gameParameters = gameParameters else { return false }
    return countTest >= gameParameters.trials.count
  }

  func clearData() {
    resultManager.cleanData()
    countTest = -1
    correctAnswers = 0
    arrayTimes = []
    invalidateTimers()
  }

  func invalidateTimers() {
    timeResponse?.invalidate()
    timerSetText?.invalidate()
  }
}

private extension GameManager {
  func updateButtonTitle() {
    guard let gameParameters = gameParameters else { return }
    guard countTest < gameParameters.trials.count else { return }

    let choices = gameParameters.trials[countTest].choices
    let countButton = choices.count

    var leftTitle: String? = nil
    var rightTitle: String? = nil
    var leftImage: URL? = nil
    var rightImage: URL? = nil

    if countButton >= 1 {
        let leftChoice = choices[0].name.en
        if let url = URL(string: leftChoice), leftChoice.contains("https") {
            leftImage = url
        } else {
            leftTitle = leftChoice
        }
    }

    if countButton == 2 {
        let rightChoice = choices[1].name.en
        if let url = URL(string: rightChoice), rightChoice.contains("https") {
            rightImage = url
        } else {
            rightTitle = rightChoice
        }
    }

    delegate?.updateTitleButton(
        left: leftTitle,
        right: rightTitle,
        leftImage: leftImage,
        rightImage: rightImage,
        countButton: countButton
    )
  }
}
