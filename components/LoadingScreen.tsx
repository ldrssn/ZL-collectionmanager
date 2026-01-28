import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loader-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700&display=swap');

        .loader-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          gap: 15px;
          transition: background-color 0.3s ease;
          background-color: #f9fafb; /* gray-50 */
        }

        .dark .loader-wrap {
          background-color: #18181b; /* zinc-900 */
        }

        .heart-pulse {
          transform-origin: 366px 366px;
          animation: pulseOut 1.5s ease-in-out infinite;
        }

        .loading-text {
          font-family: 'Nunito', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #333333;
          letter-spacing: 1px;
          transition: color 0.3s ease;
        }

        .dark .loading-text {
          color: #e4e4e7; /* zinc-200 */
        }

        /* Die Animation für die Punkte */
        .dot {
          display: inline-block;
          color: #EDC3C4;
          animation: dotPulse 1.5s ease-in-out infinite;
        }

        .dark .dot {
          color: #EDC3C4;
        }

        /* Zeitliche Verzögerung für den "Lauf-Effekt" */
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes dotPulse {
          0%, 20% { opacity: 0; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-5px); }
          80%, 100% { opacity: 0; transform: translateY(0); }
        }

        @keyframes pulseOut {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
      `}</style>

      <svg width="250" height="250" viewBox="0 0 733 733" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle className="loader-circle" cx="366.5" cy="366.5" r="366.5" fill="#EFEBE5" />
        <path className="loader-body" fill-rule="evenodd" clip-rule="evenodd" d="M365.998 112.2C318.662 112.2 280.287 150.614 280.287 198L365.998 246.845L451.71 198C451.71 150.614 413.337 112.2 365.998 112.2ZM223.146 198C223.146 119.023 287.104 55 365.998 55C444.896 55 508.852 119.023 508.852 198H490.112C502.549 198.001 511.022 205.195 520.142 205.902C530.364 206.694 527.814 224.986 537.808 229.606C552.248 236.279 556.851 245.068 565.633 258.338C571.716 267.526 591.121 267.794 593.458 277.788C595.655 287.187 603.805 289.84 605.825 302.985L618.967 383.188C624.472 419.001 628.889 447.732 630.409 471.041C631.966 494.919 630.761 516.149 622.958 536.112C611.184 566.231 589.556 591.465 561.608 607.695C543.083 618.451 522.306 622.87 498.495 624.961C475.25 627 446.208 627 410.014 627H321.985C285.791 627 256.749 627 233.505 624.961C209.692 622.87 188.915 618.451 170.391 607.695C142.443 591.465 120.816 566.231 109.041 536.112C101.238 516.149 100.034 494.919 101.591 471.041C103.111 447.735 107.527 419.001 113.031 383.191L127.058 299.448C129.078 286.305 144.295 289.397 146.492 279.998C148.828 270.004 156.172 260.895 162.254 251.708C171.038 238.437 169.153 227.438 183.592 220.765C193.588 216.145 201.193 204.317 211.417 203.525C220.538 202.819 229.451 198.001 241.887 198H223.146Z" fill="#333333" />
        <path className="heart-pulse" fill-rule="evenodd" clip-rule="evenodd" d="M263.062 187C183.903 187 122 255.929 122 337.478C122 379.894 128.775 414.822 154.033 451.572C178.132 486.64 218.207 522.026 280.389 568.712L366 627L451.605 568.72C513.791 522.031 553.868 486.64 577.968 451.572C603.224 414.822 610 379.894 610 337.478C610 255.929 548.097 187 468.939 187C429.218 187 394.836 203.212 366 232.546C337.164 203.212 302.781 187 263.062 187Z" fill="#EDC3C4" />
      </svg>

      <div className="loading-text">
        Kollektion wird geladen <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
