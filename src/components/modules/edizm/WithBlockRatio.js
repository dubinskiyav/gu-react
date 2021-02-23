import React, { useState } from 'react';

// Эта функция принимает компонент...
// https://ru.reactjs.org/docs/higher-order-components.html
function WithBlockRatio(WrappedComponent) {
  
    return class extends React.Component {

        componentWillReceiveProps(nextProps) {
            console.log("prevProps", this.props);
            console.log("nextProps", nextProps);
            if (nextProps.count !== this.props.count) {
              this.setState({
                count: nextProps.count > 100 ? 100 : nextProps.count
              });
            }
        }

        render() {
          // ... и рендерит оборачиваемый компонент со свежими данными!
          // Обратите внимание, что мы передаём остальные пропсы
          return <WrappedComponent {...this.props} />;
        }
      };
      
}

export default WithBlockRatio;