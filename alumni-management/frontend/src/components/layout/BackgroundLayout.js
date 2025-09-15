import React from 'react';

const BackgroundLayout = ({ children }) => (
  <div
    style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f7f5f3 0%, #f0ede8 25%, #f7f5f3 50%, #f0ede8 75%, #ffffff 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* วงกลมตกแต่งพื้นหลังแบบมินิมอล */}
    <div style={{
      position: 'absolute',
      top: '-200px',
      left: '-200px',
      width: '400px',
      height: '400px',
      background: 'rgba(47, 75, 63, 0.03)',
      borderRadius: '50%',
      zIndex: 0,
    }} />
    <div style={{
      position: 'absolute',
      bottom: '-150px',
      right: '-150px',
      width: '300px',
      height: '300px',
      background: 'rgba(249, 199, 79, 0.04)',
      borderRadius: '50%',
      zIndex: 0,
    }} />
    <div style={{
      position: 'absolute',
      top: '20%',
      right: '10%',
      width: '150px',
      height: '150px',
      background: 'rgba(58, 92, 75, 0.02)',
      borderRadius: '50%',
      zIndex: 0,
    }} />
    <div style={{ zIndex: 1, width: '100%' }}>
      {children}
    </div>
  </div>
);

export default BackgroundLayout;
