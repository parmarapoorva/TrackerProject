import React from 'react';
import { Card, ListGroup, ListGroupItem, Container, Row, Col } from 'react-bootstrap';

export default function ManagerProfile() {
  const managerData = {
    name: "Rushabh",
    role: "Manager",
    assignedProjects: 4,
    recentActivity: [
      "Viewed project: Habit Tracker",
      "Updated task status: eadvertisement",
      "Logged in: 2 hours ago",
    ]
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "900px" }}>
      <Row>
        <Col md={4}>
          {/* Profile Card */}
          <Card className="shadow-sm rounded">
            <Card.Header className="bg-primary text-white text-center">
              <h3>Manager Profile</h3>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <h5>{managerData.name}</h5>
                <p className="text-muted">{managerData.role}</p>
                <p className="font-weight-bold">Assigned Projects: {managerData.assignedProjects}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          {/* Recent Activity Card */}
          <Card className="shadow-sm rounded">
            <Card.Header className="bg-secondary text-white">
              <h4>Recent Activity</h4>
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {managerData.recentActivity.map((activity, index) => (
                  <ListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                    <span role="img" aria-label="pin">📌</span> {activity}
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
