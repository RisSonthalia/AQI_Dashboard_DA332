import React, { useEffect, useState } from 'react';
import LiveAQIIndicator from './LiveAQIIndicator';
const AQIDisplay = ({ currentAQI, aqiCategory }) => {
    const [animatedAQI, setAnimatedAQI] = useState(0);

    // Function to generate background gradient based on AQI value
    const getBackgroundGradient = (aqi) => {
        if (aqi === null) return 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'; // Default gradient

        if (aqi <= 50) {
            // Good - Green gradient
            return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
        } else if (aqi <= 100) {
            // Moderate - Yellow gradient
            return 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)';
        } else if (aqi <= 150) {
            // Poor - Orange gradient
            return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
        } else if (aqi <= 200) {
            // Unhealthy - Red gradient
            return 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)';
        } else if (aqi <= 300) {
            // Severe - Purple gradient
            return 'linear-gradient(135deg, #6a11cb 0%, #fc2d7f 100%)';
        } else {
            // Hazardous - Dark red/maroon gradient
            return 'linear-gradient(135deg, #7f0000 0%, #b71c1c 100%)';
        }
    };

    // Animate AQI value on component mount or when currentAQI changes
    useEffect(() => {
        if (currentAQI === null) {
            setAnimatedAQI(0);
            return;
        }

        const startValue = animatedAQI || 0;
        const endValue = currentAQI;
        const duration = 1500; // Animation duration in ms
        const startTime = Date.now();

        const animateValue = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOut = t => 1 - Math.pow(1 - t, 3);
            const easedProgress = easeOut(progress);

            const value = startValue + (endValue - startValue) * easedProgress;
            setAnimatedAQI(value);

            if (progress < 1) {
                requestAnimationFrame(animateValue);
            }
        };

        requestAnimationFrame(animateValue);
    }, [currentAQI]);

    return (
        <div
            className="aqi-display"
            style={{
                background: getBackgroundGradient(currentAQI),
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                color: currentAQI > 150 ? '#fff' : '#333',
                position: 'relative',
                overflow: 'hidden',
                animation: 'gradientShift 10s ease infinite',
            }}
        >
            {/* Live AQI indicator */}
            <LiveAQIIndicator />


            {/* Animated background bubbles */}
            <div className="animated-background" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
                zIndex: 0,
                opacity: 0.4
            }}>
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: `${Math.random() * 80 + 40}px`,
                            height: `${Math.random() * 80 + 40}px`,
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.2)',
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            {/* Content Container */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                    className="aqi-gauge"
                    style={{
                        background: `conic-gradient(
                            ${aqiCategory?.color || '#e0e0e0'} ${(animatedAQI / 500) * 360}deg, 
                            #e0e0e0 ${(animatedAQI / 500) * 360}deg 360deg
                        )`,
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                        margin: '0 auto 20px',
                        width: '180px',
                        height: '180px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        transition: 'transform 0.3s ease',
                        animation: 'pulse 2s infinite ease-in-out',
                    }}
                >
                    {/* Dial Marker */}
                    <div
                        style={{
                            position: 'absolute',
                            width: '8px',
                            height: '90px',
                            background: 'white',
                            borderRadius: '4px',
                            bottom: '50%',
                            left: '50%',
                            transformOrigin: 'bottom center',
                            transform: `translateX(-50%) rotate(${(animatedAQI / 500) * 360}deg)`,
                            zIndex: 2,
                            transition: 'transform 0.3s ease'
                        }}
                    >
                        <div
                            style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                background: 'white',
                                position: 'absolute',
                                top: '0',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                boxShadow: '0 0 5px rgba(0,0,0,0.3)'
                            }}
                        />
                    </div>

                    <div
                        className="aqi-value"
                        style={{
                            background: '#fff',
                            width: '70%',
                            height: '70%',
                            borderRadius: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '2.5rem',
                            color: aqiCategory?.color || '#333',
                            position: 'relative',
                            zIndex: 3,
                            boxShadow: '0 0 15px rgba(0,0,0,0.1)',
                        }}
                    >
                        {currentAQI !== null ? Math.round(animatedAQI) : '--'}
                        <div
                            className="aqi-label"
                            style={{
                                fontSize: '1rem',
                                fontWeight: 'normal',
                                marginTop: '5px'
                            }}
                        >
                            AQI
                        </div>
                    </div>
                </div>

                <div
                    className="aqi-category"
                    style={{
                        textAlign: 'center',
                        marginBottom: '20px',
                        padding: '0 15px'
                    }}
                >
                    {aqiCategory && (
                        <>
                            <h3
                                style={{
                                    color: currentAQI > 200 ? '#fff' : aqiCategory.color,
                                    fontSize: '1.5rem',
                                    margin: '0 0 10px',
                                    animation: 'fadeIn 1s ease-in'
                                }}
                            >
                                {aqiCategory.level}
                            </h3>
                            <p style={{
                                margin: '0',
                                lineHeight: '1.4',
                                animation: 'fadeIn 1.5s ease-in'
                            }}>
                                {aqiCategory.healthImplications}
                            </p>
                        </>
                    )}
                </div>

                <div
                    className="aqi-container"
                    style={{
                        background: 'rgba(255, 255, 255, 0.85)',
                        borderRadius: '8px',
                        padding: '15px',
                        color: '#333',
                        animation: 'slideUp 0.8s ease-out'
                    }}
                >
                    <div className="aqi-background">
                        <div
                            className="category-labels"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '5px',
                                fontSize: '0.75rem'
                            }}
                        >
                            <div className="category-label">Good</div>
                            <div className="category-label">Moderate</div>
                            <div className="category-label">Poor</div>
                            <div className="category-label">Unhealthy</div>
                            <div className="category-label">Severe</div>
                            <div className="category-label">Hazardous</div>
                        </div>

                        <div
                            className="gradient-bar"
                            style={{
                                height: '20px',
                                borderRadius: '10px',
                                position: 'relative',
                                background: 'linear-gradient(to right, #43e97b, #f6d365, #fa709a, #ff0844, #6a11cb, #7f0000)',
                                marginBottom: '5px',
                                animation: 'glow 2s ease-in-out infinite alternate'
                            }}
                        >
                            <div
                                className="indicator"
                                style={{
                                    position: 'absolute',
                                    width: '12px',
                                    height: '24px',
                                    background: '#fff',
                                    borderRadius: '6px',
                                    top: '-2px',
                                    left: `${Math.min((animatedAQI / 300) * 100, 100)}%`,
                                    transform: 'translateX(-50%)',
                                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
                                    transition: 'left 1.5s ease'
                                }}
                            ></div>
                        </div>

                        <div
                            className="value-markers"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.75rem'
                            }}
                        >
                            <div>0</div>
                            <div>50</div>
                            <div>100</div>
                            <div>150</div>
                            <div>200</div>
                            <div>300</div>
                            <div>301+</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS Animations and Styles */}
            <style jsx>{`
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }
                
                @keyframes float {
                    0% { transform: translateY(0) translateX(0); }
                    25% { transform: translateY(-20px) translateX(10px); }
                    50% { transform: translateY(0) translateX(20px); }
                    75% { transform: translateY(20px) translateX(10px); }
                    100% { transform: translateY(0) translateX(0); }
                }
                
                @keyframes glow {
                    0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
                    100% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.7); }
                }
                
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                
                @keyframes slideUp {
                    0% { transform: translateY(20px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }

                @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0; }
                    100% { opacity: 1; }
                }

                .live-indicator {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: red;
                    animation: blink 1s infinite;
                    z-index: 10;
                }
            `}</style>
        </div>
    );
};

export default AQIDisplay;
