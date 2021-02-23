import React, { Component } from "react";

import Counter from "./counter";

class Test01 extends Component {
    state = {
        count: 0,
    }
    render() {
        const { count } = this.state;
        return (
            <div className="container">
                <Counter 
                    count={count}
                    onCountUp={() => this.setState({ count: count + 1})}
                    onCountDown={() => this.setState({ count: count - 1})}
                />
            </div>
        );
    }
}

export default Test01;