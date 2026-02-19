import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import './AdminDashboardNew.css';
import { networkingService } from '../services/networkingService';

const NetworkingHub = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await networkingService.getAll();
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (err) {
      setError('Error fetching posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (post = null) => {
    setCurrentPost(post);
    if (post) {
      setFormData({ title: post.title || '', content: post.content || '' });
    } else {
      setFormData({ title: '', content: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentPost(null);
  };

  const handleSave = async () => {
    try {
      if (currentPost) {
        await networkingService.update(currentPost.id, formData);
      } else {
        await networkingService.create(formData);
      }
      fetchPosts();
      closeModal();
    } catch (err) {
      setError('Error saving post');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await networkingService.delete(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      setError('Error deleting post');
      console.error(err);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Container fluid className="pt-4">
          <Row className="mb-3">
            <Col md={6}>
              <h1>Networking Hub</h1>
              <p>Manage connections and posts; search and filter alumni.</p>
            </Col>
            <Col md={3} className="text-end">
              <Button variant="primary" onClick={() => openModal()}>+ New Post</Button>
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </Col>
          </Row>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" />
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts
              .filter(post =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.content.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((post, idx) => (
                  <tr key={post.id}>
                    <td>{idx + 1}</td>
                    <td>{post.title}</td>
                    <td>{post.content}</td>
                    <td>
                      <Button size="sm" variant="warning" className="me-2" onClick={() => openModal(post)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(post.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Container>
      </div>

      {/* modal for create/edit */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentPost ? 'Edit Post' : 'New Post'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="postTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="postContent">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NetworkingHub;
