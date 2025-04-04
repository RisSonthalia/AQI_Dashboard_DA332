import React, { useState } from 'react';

const CigaretteEquivalentCard = ({ pm25Level }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Calculate cigarette equivalents based on Berkeley Earth's rule of thumb
  const cigarettesPerDay = parseFloat((pm25Level / 22).toFixed(1));
  const cigarettesPerWeek = parseFloat((cigarettesPerDay * 7).toFixed(1));
  const cigarettesPerMonth = parseFloat((cigarettesPerDay * 30).toFixed(1));

  return (
    <div className="cigarette-equivalent-card" style={{
      backgroundColor: '#c1c5c9',
      color: 'white',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '20px',
      width: '100%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#f56565' }}>{cigarettesPerDay}</span>
          <span style={{ fontSize: '1rem', color: '#f56565' }}>Cigarettes</span>
          <span style={{ fontSize: '1rem', color: '#f56565' }}>per day</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
          {/* Simple SVG cigarette icon */}
          <svg width="30" height="100" viewBox="0 0 30 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="20" width="20" height="80" fill="white" />
            <rect x="5" y="5" width="20" height="15" fill="#D4A76A" />
            <path d="M15 0C12 0 8 1 8 5H22C22 1 18 0 15 0Z" fill="#D4A76A" />
            <path d="M8 20C8 20 12 25 15 25C18 25 22 20 22 20H8Z" fill="#D4A76A" />
            <g opacity="0.5">
              <path d="M15 25C18 30 12 35 15 40C18 45 12 50 15 55" stroke="#CCCCCC" strokeWidth="1" />
            </g>
          </svg>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '1.2rem' }}>Weekly</span>
            <div>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f56565' }}>{cigarettesPerWeek}</span>
              <span style={{ fontSize: '1rem', color: '#f56565' }}> Cigarettes</span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '1.2rem' }}>Monthly</span>
            <div>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f56565' }}>{cigarettesPerMonth}</span>
              <span style={{ fontSize: '1rem', color: '#f56565' }}> Cigarettes</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <p>Breathing the air in this location is as harmful as smoking {cigarettesPerDay} cigarettes a day.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '10px' }}>
          <span style={{ marginRight: '10px' }}>Source:</span>
          <span style={{ color: '#9CA3AF' }}>Berkeley Earth</span>
          <span 
            style={{ 
              marginLeft: '8px', 
              border: '1px solid #9CA3AF', 
              borderRadius: '50%', 
              width: '20px', 
              height: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '12px',
              position: 'relative',
              cursor: 'pointer'
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            i
            {showTooltip && (
              <div style={{
                position: 'absolute',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#333',
                color: 'white',
                padding: '8px',
                borderRadius: '5px',
                fontSize: '12px',
                width: '250px',
                textAlign: 'center',
                zIndex: '10'
              }}>
                <strong>Berkeley Earth</strong><br/>
                According to Berkeley Earth’s rule of thumb, one cigarette per day is equivalent to 22 μg/m3 of PM2.5 level.
              </div>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CigaretteEquivalentCard;
