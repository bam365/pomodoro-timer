import * as _ from 'lodash';
import * as React from 'react';

interface Props {
    seconds: number,
}

const TimeDisplay: React.FC<Props> = (props) => {
    const minutes = Math.floor(props.seconds / 60);
    const seconds = props.seconds % 60;
    const zeroPad = (n: number) =>  _.padStart(String(n), 2, '0');

    return (
        <div className="timeDisplay">
            <span className="timeDisplay-minutes">{zeroPad(minutes)}</span>
            <span className="timeDisplay-divider">:</span>
            <span className="timeDisplay-seconds">{zeroPad(seconds)}</span>
        </div>
    );
};

export default TimeDisplay;
