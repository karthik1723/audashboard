import './index.css';
import { Component } from 'react';

class Scrolling extends Component{
    render() {
        return(
            <>
            <div className='scrolling-main'>
                <marquee direction="left" scrollamount='10'>
                <h1>
                    <span className="scroll-head">AU</span>
                    <span className="scroll-head">Dashboard</span>
                    <span className="scroll-head">:</span>
                    <span className="scroll-head">Your</span>
                    <span className="scroll-head">All-in-One</span>
                    <span className="scroll-head">University</span>
                    <span className="scroll-head">Data</span>
                    <span className="scroll-head">Companion</span>
                </h1>

                </marquee>
            </div>
            </>
        );
    }
}

export default Scrolling;