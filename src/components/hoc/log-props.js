import React from "react";

/**
 * https://www.youtube.com/watch?v=G2NBRu6TFPk&ab_channel=CodeDojo
 * Компонент высшего порядка
 * @param {*} Component 
 */

function logProps(Component) {
    class LogProps extends React.Component {
        componentWillReceiveProps(nextProps) { // Вызывается при каждом рендере
            console.log("prevProps", this.props);
            console.log("nextProps", nextProps);
        }
        render() {
            return <Component {...this.props}/>;
        }
    }

    LogProps.displayName = 'LogProps(${Component.displayName || Component.name || "Component"})';

    return LogProps;

}

export default logProps;