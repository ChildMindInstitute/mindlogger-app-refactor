import React, { forwardRef, useContext, useImperativeHandle } from 'react';

import { act, render } from '@testing-library/react-native';

import { HandlersContext, ValuesContext } from '../contexts';
import { Stepper } from '../index';

jest.mock('../../ViewSlider', () => {
  const { forwardRef: mockForwardRef, useImperativeHandle: mockUseHandle } =
    jest.requireActual<typeof import('react')>('react');

  return {
    // Always able to move, like the real slider between the first and last view
    ViewSlider: mockForwardRef((_: unknown, ref) => {
      mockUseHandle(ref, () => ({ next: () => true, back: () => true }));

      return null;
    }),
  };
});

type NextArgs = {
  isForced: boolean;
  shouldAutoSubmit: boolean;
  fromStep?: number;
};

type Handle = {
  next: (args: NextArgs) => Promise<void> | void;
  getCurrentStep: () => number;
};

const Harness = forwardRef<Handle>((_, ref) => {
  const { next } = useContext(HandlersContext);
  const { getCurrentStep } = useContext(ValuesContext);

  useImperativeHandle(ref, () => ({ next, getCurrentStep }));

  return null;
});

const renderStepper = () => {
  const harnessRef = React.createRef<Handle>();
  const onNext = jest.fn();

  render(
    <Stepper
      startFrom={0}
      stepsCount={5}
      onNext={onNext}
      onBeforeNext={() => Promise.resolve({ stepShift: 1 })}
    >
      <Stepper.ViewList renderItem={() => <></>} />
      <Harness ref={harnessRef} />
    </Stepper>,
  );

  return { harness: harnessRef.current as Handle, onNext };
};

describe('Stepper', () => {
  it('Should move only once when two forced moves come from the same step', async () => {
    const { harness, onNext } = renderStepper();

    await act(async () => {
      await harness.next({
        isForced: true,
        shouldAutoSubmit: false,
        fromStep: 0,
      });
      await harness.next({
        isForced: true,
        shouldAutoSubmit: false,
        fromStep: 0,
      });
    });

    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledWith(1, true, undefined);
    expect(harness.getCurrentStep()).toBe(1);
  });

  it('Should ignore a move requested by a step that is no longer current', async () => {
    const { harness, onNext } = renderStepper();

    await act(async () => {
      await harness.next({
        isForced: true,
        shouldAutoSubmit: false,
        fromStep: 3,
      });
    });

    expect(onNext).not.toHaveBeenCalled();
    expect(harness.getCurrentStep()).toBe(0);
  });

  it('Should move on every request when no source step is given', async () => {
    const { harness, onNext } = renderStepper();

    await act(async () => {
      await harness.next({ isForced: false, shouldAutoSubmit: true });
      await harness.next({ isForced: false, shouldAutoSubmit: true });
    });

    expect(onNext).toHaveBeenCalledTimes(2);
    expect(harness.getCurrentStep()).toBe(2);
  });
});
