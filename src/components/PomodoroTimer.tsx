import * as React from 'react';

import TimeDisplay from './TimeDisplay';

type Seconds = number;
type TimerId = number;

type TimerState =
    | { type: 'off' }
    | { type: 'queued' }
    | { type: 'running', timerId: TimerId }
    | { type: 'completed' }

interface State {
    timer: TimerState,
    timerName: string,
    timeRemaining: Seconds,
    shouldStartTimer: boolean,
}

type Action =
    | { type: 'set-timer', timerId: TimerId }
    | { type: 'set-time', name: string, time: Seconds }
    | { type: 'play-pause' }
    | { type: 'tick' }


const reducer: React.Reducer<State, Action> = (state: State, action: Action) => {
    const killRunningTimer = () => {
        if (state.timer.type === 'running') {
            clearInterval(state.timer.timerId);
        }
    };

    switch (action.type) {
        case 'set-timer':
            killRunningTimer();
            return { ...state, timer: { type: 'running', timerId: action.timerId } }

        case 'set-time':
            killRunningTimer();
            return { 
                ...state, 
                timer: { type: 'off' },
                timerName: action.name, 
                timeRemaining: action.time 
            };

        case 'tick': 
            if (state.timer.type !== 'running') {
                return state;
            }

            if (state.timeRemaining === 0) {
                killRunningTimer();
                return { ...state, timer: { type: 'completed' } }
            } else {
                return { ...state, timeRemaining: state.timeRemaining - 1 }
            }

        case 'play-pause':
            if (state.timer.type === 'off') {
                return { ...state, timer: { type: 'queued' } }
            } else if (state.timer.type === 'running') {
                killRunningTimer();
                return {...state, timer: { type: 'off' } };
            }  else {
                return state;
            }
    }
};

const initState: State = {
    timer: { type: 'off' },
    timerName: 'Test',
    timeRemaining: 5,
    shouldStartTimer: false,
};

const timerPresets = [
    { name: 'Pomodoro', time: 25 * 60 },
    { name: 'Short Break', time: 5 * 60 },
    { name: 'Long Break', time: 15 * 60 },
];

const PomodoroTimer: React.FC<{}> = () => {

    const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(reducer, initState);
    
    React.useEffect(() => {
        if (state.timer.type === 'queued') {
            const timerId = setInterval(() => dispatch({ type: 'tick' }), 1000);
            dispatch({ type: 'set-timer', timerId });
        }
    });

    const presetButtons = timerPresets.map((timeSpec) => (
        <div>
            <button 
                type='button'
                onClick={() => dispatch({ type: 'set-time', ...timeSpec })}
            >
                {timeSpec.name}
            </button>
        </div>
    ))

    return (
        <div className="pomodoro">
            <div className="pomodoro-sidebar">
                <p>Set Timer</p>
                <div className="pomodoro-sidebarButtons">
                    {presetButtons}
                </div>
            </div>
            <div className="pomodoro-main">
                <h2>{state.timerName}</h2>
                <TimeDisplay seconds={state.timeRemaining} />
                <button 
                    type="button"
                    onClick={() => dispatch({ type: 'play-pause' })}
                >
                    Play/Pause
                </button>
            </div>
        </div>
    );
}

export default PomodoroTimer;
