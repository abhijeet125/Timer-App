import { useReducer,createContext,useContext,type ReactNode } from "react";

export type Timer = {
    name : string;
    duration : number;
}

type TimerState = {
    isRunning : boolean;
    timers: Timer[];
}

type TimersContextValue = TimerState & {
    addTimer : (timerData : Timer) => void,
    startTimers : () => void,
    stopTimers : () => void
}

const initialState : TimerState ={
    isRunning: true,
    timers: [],
}
 const TimersContext = createContext<TimersContextValue | null>(null);

export function useTimersContext () {
const timerCtx = useContext(TimersContext);

if(timerCtx === null){
    throw new Error("timerCtx should not be null");
    
}
return timerCtx;

}

type TimersContextProviderProps = {
children : ReactNode;
}
type AddTimerAction = {
    type : 'ADD_TIMER';
    payload : Timer;
}
type StartTimerAction = {
    type : 'START_TIMERS';
}
type StopTimerAction = {
    type : 'STOP_TIMERS';
}
type Action = AddTimerAction | StartTimerAction | StopTimerAction
function timersReducer(state: TimerState, action: Action):TimerState{
if(action.type === 'START_TIMERS'){
    return {
        ...state,
        isRunning: true,
    }
}
if(action.type === 'STOP_TIMERS'){
    return {
        ...state,
        isRunning: false,
    }
}
if(action.type === 'ADD_TIMER'){
    return {
        ...state,
        timers : [
            ...state.timers,
            {
            name: action.payload.name,
            duration :action.payload.duration,
            }
        ]
    }
}
return state
}

export default function TimersContextProvider ( {children}: TimersContextProviderProps) {
    const [timersState, dispatch] = useReducer(timersReducer, initialState)
    const ctx : TimersContextValue = {
        timers: timersState.timers,
        isRunning : timersState.isRunning,
        addTimer(timerData){
            dispatch({type: 'ADD_TIMER', payload:timerData});
        },
        startTimers(){
            dispatch({type:'START_TIMERS'});
        },
        stopTimers(){
            dispatch({type:'STOP_TIMERS'});
        }
    }
return <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>
}