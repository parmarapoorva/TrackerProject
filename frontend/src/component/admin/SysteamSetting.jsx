import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Alert, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { FaSave, FaLock, FaUserCog, FaPalette } from "react-icons/fa";
import axios from "axios";
import "./sysyemsetting.css";

const API_BASE_URL = "https://trackerproject-backend.onrender.com";

const SysteamSetting = () => {
  const [systemName, setSystemName] = useState("Project Manager");
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("GMT");
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    const settingsData = {
      systemName,
      theme,
      language,
      timezone,
      notifications,
      twoFactor,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/system/settings`, settingsData);
      
      if (response.status === 200) {
        setMessage("✅ Settings saved successfully!");
        setError("");
      } else {
        setError("❌ Failed to save settings. Please try again.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("❌ Error connecting to the server.");
    }

    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">⚙️ System Settings</h2>

      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4">
        {/* General Settings */}
        <Col md={6}>
          <Card className="shadow-lg">
            <Card.Body>
              <Card.Title><FaPalette /> General Settings</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>System Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Theme</Form.Label>
                  <ToggleButtonGroup
                    type="radio"
                    name="themeOptions"
                    value={theme}
                    onChange={setTheme}
                  >
                    <ToggleButton id="light-theme" value="light" variant="outline-primary">
                      Light
                    </ToggleButton>
                    <ToggleButton id="dark-theme" value="dark" variant="outline-dark">
                      Dark
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Form.Group>

                <Button variant="primary" onClick={handleSave}>
                  <FaSave /> Save General
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* User Preferences */}
        <Col md={6}>
          <Card className="shadow-lg">
            <Card.Body>
              <Card.Title><FaUserCog /> User Preferences</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Language</Form.Label>
                  <Form.Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Timezone</Form.Label>
                  <Form.Control
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="notifications-switch"
                    label="Enable Notifications"
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                  />
                </Form.Group>

                <Button variant="primary" onClick={handleSave}>
                  <FaSave /> Save Preferences
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Security Settings */}
      <Row className="mt-4">
        <Col md={12}>
          <Card className="shadow-lg">
            <Card.Body>
              <Card.Title><FaLock /> Security Settings</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="two-factor-switch"
                    label="Enable Two-Factor Authentication"
                    checked={twoFactor}
                    onChange={() => setTwoFactor(!twoFactor)}
                  />
                </Form.Group>

                <Button variant="danger" onClick={handleSave}>
                  <FaSave /> Save Security
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SysteamSetting;
