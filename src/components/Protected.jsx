import React from 'react';

const Protected = () => {
  console.log('Protected');
  return (
    <div className='pt-5' style={{ color: 'red' }}>
      PROTECTED
    </div>
  );
};

export default Protected;
