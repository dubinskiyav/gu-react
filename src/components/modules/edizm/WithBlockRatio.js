import React, { useState } from 'react';

// Эта функция принимает компонент...
function WithBlockRatio(WrappedComponent) {
  
    return class extends React.Component {
        constructor(props) {
          super(props);
        }
    
    
        render() {
          // ... и рендерит оборачиваемый компонент со свежими данными!
          // Обратите внимание, что мы передаём остальные пропсы
          return <WrappedComponent {...this.props} />;
        }
      };
      
}

export default WithBlockRatio;