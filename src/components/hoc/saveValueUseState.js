import React from "react";

/**
 * https://www.youtube.com/watch?v=G2NBRu6TFPk&ab_channel=CodeDojo
 * Компонент высшего порядка
 * Созраняет в состоянии value из переданного компонента
 */

const saveValueUseState = (Component)=>{

    class SaveValueUseState extends React.Component {
        componentWillReceiveProps(nextProps) { // Вызывается при каждом рендере
            console.log("prevProps", this.props);
            console.log("nextProps", nextProps);
            const [value, setValue] = React.useState(nextProps);
            setValue(value);
        }
        render() {
            return <Component {...this.props}/>;
        }
    }

    LogProps.displayName = 'SaveValueUseState(${Component.displayName || Component.name || "Component"})';

    return SaveValueUseState;

}

export default saveValueUseState;
