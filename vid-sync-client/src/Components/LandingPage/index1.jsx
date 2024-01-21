// Import necessary React and styled-components libraries
import React from 'react';
import styled from 'styled-components';

// Styled components for the landing page
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Header = styled.header`
  text-align: center;
  color: #fff;
`;

const Background = styled.div`
  background: url('background-image.jpg') center/cover no-repeat;
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: -1;
  filter: brightness(0.7); /* Adjust background brightness if needed */
`;

const Button = styled.button`
  background-color: #3498db;
  color: #fff;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  margin-top: 20px;
`;

const FeaturesSection = styled.section`
  display: flex;
  justify-content: space-around;
  margin: 50px 0;

  div {
    text-align: center;
    max-width: 300px;

    h2 {
      color: #333;
    }

    p {
      color: #666;
    }
  }
`;

// React component for the landing page
export const LandingPage = () => {
  return (
    <Container>
      <Background />
      <Header>
        <h1>SyncUp Party</h1>
        <p>Watch Together, Party Together!</p>
      </Header>
      <Button>Start Your Party Now</Button>
      <FeaturesSection>
        <div>
          <h2>Synced Video Playback</h2>
          <p>Watch videos in real-time synchronization with your friends.</p>
        </div>
        <div>
          <h2>Easy Hosting</h2>
          <p>Host your party with a simple click and drag-and-drop interface.</p>
        </div>
        <div>
          <h2>Group Chat</h2>
          <p>Chat and share reactions in real-time with your party members.</p>
        </div>
        <div>
          <h2>Cross-Device Compatibility</h2>
          <p>Join the party from your phone, tablet, or computer.</p>
        </div>
      </FeaturesSection>
      {/* Additional sections (Testimonials, Footer, etc.) can be added here */}
    </Container>
  );
};

// export default LandingPage;
