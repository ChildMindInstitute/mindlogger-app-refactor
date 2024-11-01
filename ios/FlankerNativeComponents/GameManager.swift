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
    static let debounceInterval: TimeInterval = 0.25
    static let blueColor: UIColor = UIColor(red: 37, green: 95, blue: 158)
    static let greenColor: UIColor = UIColor(red: 68, green: 133, blue: 87)
    static let redColor: UIColor = UIColor(red: 199, green: 20, blue: 20)
    static let correctText: String = "Correct!"
    static let inCorrectText: String = "Incorrect"
    static let timeRespondText: String = "Respond faster"
    static let bigFont: UIFont = .systemFont(ofSize: 50.0, weight: .bold)
    static let smallFont: UIFont = .systemFont(ofSize: 30.0, weight: .bold)
    static let tag: String = "trial"
    static let trialTag: String = "html-button-response"
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
    private var debounceTimer: Timer?

    private var countTest = 0
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

    private var isFirst = true
    private var inFeedback = false
    private var clickedInCurrentBlock = false 

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
        updateButtonTitle()
        resultManager.cleanData()
        countTest = 0
        correctAnswers = 0
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
                startTrialTimestamp = time
            case .feedback:
                startFeedbackTimestamp = time
            case .response:
                respondTouchButton = time
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
                respondTouchButton = time
            }
        }
    }

    func checkedAnswer(button: SelectedButton) {
        guard !inFeedback && !clickedInCurrentBlock else { return }
        clickedInCurrentBlock = true 
        invalidateTimers()

        debounceTimer?.invalidate()
        debounceTimer = Timer.scheduledTimer(withTimeInterval: 0.25, repeats: false) { [weak self] _ in
            self?.processCheckedAnswer(button: button)
        }
    }

    private func processCheckedAnswer(button: SelectedButton) {
        delegate?.setEnableButton(isEnable: false)

        guard let gameParameters = gameParameters else { return }
        guard
            let startTrialTimestamp = startTrialTimestamp,
            let respondTouchButton = respondTouchButton
        else { return }

        let resultTime = (respondTouchButton - startTrialTimestamp) * 1000
        arrayTimes.append(resultTime.convertToInt())
        delegate?.updateTime(time: String(format: "%.3f", resultTime))

        let correctChoice = (button == .left && gameParameters.trials[countTest].correctChoice == 0) ||
                            (button == .right && gameParameters.trials[countTest].correctChoice == 1)
        
        if correctChoice {
            correctAnswers += 1
            if gameParameters.showFeedback {
                delegate?.updateText(text: Constants.correctText, color: Constants.greenColor, font: Constants.smallFont, isStart: false, typeTime: .feedback)
            }
            responseText = Constants.correctText
        } else {
            if gameParameters.showFeedback {
                delegate?.updateText(text: Constants.inCorrectText, color: Constants.redColor, font: Constants.smallFont, isStart: false, typeTime: .feedback)
            }
            responseText = Constants.inCorrectText
        }

        if gameParameters.showFeedback {
            inFeedback = true
            Timer.scheduledTimer(timeInterval: Constants.lowTimeInterval, target: self, selector: #selector(setDefaultText), userInfo: nil, repeats: false)
        } else {
            setDefaultText(isFirst: false)
        }
    }

    @objc func setDefaultText(isFirst: Bool) {
        guard let gameParameters = gameParameters else { return }

        inFeedback = false
        clickedInCurrentBlock = false

        if !isFirst {
            countTest += 1
        }

        if gameParameters.showFixation {
            if let image = URL(string: gameParameters.fixation), gameParameters.fixation.contains("https") {
                delegate?.updateFixations(image: image, isStart: false, typeTime: .fixations)
            } else {
                delegate?.updateText(text: gameParameters.fixation, color: .black, font: Constants.bigFont, isStart: false, typeTime: .fixations)
            }
        }

        if isEndGame() { return }
        invalidateTimers()
        updateButtonTitle()

        if gameParameters.showFixation {
            delegate?.setEnableButton(isEnable: false)
            timerSetText = Timer(timeInterval: gameParameters.fixationDuration / 1000, target: self, selector: #selector(setText), userInfo: nil, repeats: false)
            RunLoop.main.add(timerSetText!, forMode: .common)
        } else {
            setText()
        }
    }

    @objc func setText() {
        guard let gameParameters = gameParameters else { return }

        text = gameParameters.trials[countTest].stimulus.en

        if let image = URL(string: text), text.contains("https") {
            delegate?.updateFixations(image: image, isStart: true, typeTime: .trial)
        } else {
            delegate?.updateText(text: text, color: .black, font: Constants.bigFont, isStart: true, typeTime: .trial)
        }

        delegate?.setEnableButton(isEnable: true)
        timeResponse = Timer(timeInterval: gameParameters.trialDuration / 1000, target: self, selector: #selector(timeResponseFailed), userInfo: nil, repeats: false)
        RunLoop.main.add(timeResponse!, forMode: .common)
    }

    @objc func timeResponseFailed() {
        guard let gameParameters = gameParameters else { return }

        delegate?.setEnableButton(isEnable: false)
        delegate?.updateText(text: Constants.timeRespondText, color: .black, font: Constants.smallFont, isStart: false, typeTime: .feedback)

        guard
            let startTrialTimestamp = startTrialTimestamp,
            let endTrialTimestamp = endTrialTimestamp
        else { return }

        let model = FlankerModel(rt: 0.0,
                                 stimulus: text,
                                 button_pressed: nil,
                                 image_time: endTrialTimestamp * 1000, // має намалювати
                                 correct: false,
                                 start_timestamp: 0, // вже намальовано
                                 tag: Constants.tag,
                                 trial_index: countTest + 1,
                                 start_time: startTrialTimestamp * 1000,
                                 response_touch_timestamp: 0)

        resultManager.addStepData(data: model)
        delegate?.resultTest(avrgTime: nil, procentCorrect: nil, data: model, dataArray: nil, isShowResults: gameParameters.showResults, minAccuracy: gameParameters.minimumAccuracy)
        responseText = Constants.timeRespondText

        let timer = Timer(timeInterval: Constants.lowTimeInterval, target: self, selector: #selector(self.setDefaultText), userInfo: nil, repeats: false)
        RunLoop.main.add(timer, forMode: .common)
    }

    func clearData() {
        resultManager.cleanData()
        countTest = 0
        correctAnswers = 0
        arrayTimes = []
        invalidateTimers()
    }

    private func invalidateTimers() {
        timeResponse?.invalidate()
        timerSetText?.invalidate()
        debounceTimer?.invalidate()
    }
    
    private func updateButtonTitle() {
        guard let gameParameters = gameParameters else { return }

        if gameParameters.trials[countTest].choices.count == 2 {
            if
                let leftImage = URL(string: gameParameters.trials[countTest].choices[0].name.en),
                let rightImage = URL(string: gameParameters.trials[countTest].choices[1].name.en),
                gameParameters.trials[countTest].choices[0].name.en.contains("https"),
                gameParameters.trials[countTest].choices[1].name.en.contains("https") {
                delegate?.updateTitleButton(left: nil, right: nil, leftImage: leftImage, rightImage: rightImage, countButton: 2)
            }
            else if
                let leftImage = URL(string: gameParameters.trials[countTest].choices[0].name.en),
                gameParameters.trials[countTest].choices[0].name.en.contains("https"),
                !gameParameters.trials[countTest].choices[1].name.en.contains("https") {
                delegate?.updateTitleButton(left: nil, right: gameParameters.trials[countTest].choices[1].name.en, leftImage: leftImage, rightImage: nil, countButton: 2)
            }
            else if
                let rightImage = URL(string: gameParameters.trials[countTest].choices[1].name.en),
                gameParameters.trials[countTest].choices[1].name.en.contains("https"),
                !gameParameters.trials[countTest].choices[0].name.en.contains("https") {
                delegate?.updateTitleButton(left: gameParameters.trials[countTest].choices[0].name.en, right: nil, leftImage: nil, rightImage: rightImage, countButton: 2)
            }
            else {
                delegate?.updateTitleButton(left: gameParameters.trials[countTest].choices[0].name.en, right: gameParameters.trials[countTest].choices[1].name.en, leftImage: nil, rightImage: nil, countButton: 2)
            }
        } else {
            if
                let leftImage = URL(string: gameParameters.trials[countTest].choices[0].name.en),
                gameParameters.trials[countTest].choices[0].name.en.contains("https") {
                delegate?.updateTitleButton(left: nil, right: nil, leftImage: leftImage, rightImage: nil, countButton: 1)
            } else {
                delegate?.updateTitleButton(left: gameParameters.trials[countTest].choices[0].name.en, right: nil, leftImage: nil, rightImage: nil, countButton: 1)
            }
        }
    }

    private func isEndGame() -> Bool {
        guard let gameParameters = gameParameters else { return false }
        if countTest == gameParameters.trials.count {
            let sumArray = arrayTimes.reduce(0, +)
            var avrgArray: Int = 0
            if arrayTimes.count != 0 {
                avrgArray = sumArray / arrayTimes.count
            }
            let procentsCorrect = Float(correctAnswers) / Float(countAllGame) * 100
            if !gameParameters.showFixation {
                setEndTimeViewingImage(time: CACurrentMediaTime(), isStart: true, type: .fixations)
            }
            delegate?.resultTest(avrgTime: avrgArray, procentCorrect: Int(procentsCorrect), data: nil, dataArray: resultManager.oneGameDataResult, isShowResults: gameParameters.showResults, minAccuracy: gameParameters.minimumAccuracy)
            clearData()
            return true
        } else {
            return false
        }
    }
}
