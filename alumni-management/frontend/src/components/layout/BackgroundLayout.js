import React from 'react';

const BackgroundLayout = ({ children }) => (
  <div
    style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fafbfc 0%, #f8fafc 25%, #f1f5f9 50%, #f8fafc 75%, #ffffff 100%)',
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
      background: 'rgba(59, 130, 246, 0.03)',
      borderRadius: '50%',
      zIndex: 0,
    }} />
    <div style={{
      position: 'absolute',
      bottom: '-150px',
      right: '-150px',
      width: '300px',
      height: '300px',
      background: 'rgba(124, 58, 237, 0.02)',
      borderRadius: '50%',
      zIndex: 0,
    }} />
    <div style={{
      position: 'absolute',
      top: '20%',
      right: '10%',
      width: '150px',
      height: '150px',
      background: 'rgba(236, 72, 153, 0.02)',
      borderRadius: '50%',
      zIndex: 0,
    }} />
    <div style={{ zIndex: 1, width: '100%' }}>
      {children}
    </div>
  </div>
);

export default BackgroundLayout;
