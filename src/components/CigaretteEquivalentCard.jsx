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
          <svg width="200" height="120" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          
            <rect width="200" height="120"  />

            
            <rect x="20" y="80" width="140" height="15" fill="white" stroke="black" stroke-width="0.5" />

            
            <rect x="20" y="80" width="30" height="15" fill="#D4A76A" />

            
            <path d="M160 80 L175 78 Q180 85 175 92 L160 95 Z" fill="darkred" />

           
            <circle cx="172" cy="85" r="5" fill="gray" />
            <circle cx="170" cy="87" r="4" fill="lightgray" />

        
            <circle cx="175" cy="65" r="10" fill="gray" opacity="0.5" />
            <circle cx="180" cy="50" r="15" fill="gray" opacity="0.5" />
            <circle cx="185" cy="35" r="12" fill="gray" opacity="0.5" />
            <circle cx="190" cy="25" r="8" fill="gray" opacity="0.5" />
            <circle cx="192" cy="20" r="5" fill="gray" opacity="0.5" />
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
                <strong>Berkeley Earth</strong><br />
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
