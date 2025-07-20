import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

// Mock certificate data
const initialCertificates = [
  {
    id: '1',
    title: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: '2024-03-15',
    category: 'Cloud',
    imageUrl: 'https://images.pexels.com/photos/325111/pexels-photo-325111.jpeg',
    takeaway: 'Gained foundational knowledge of AWS services, security, and architecture concepts.'
  },
  {
    id: '2',
    title: 'Meta Front-End Development',
    issuer: 'Meta',
    date: '2023-11-22',
    category: 'Development',
    imageUrl: 'https://images.pexels.com/photos/92904/pexels-photo-92904.jpeg',
    takeaway: 'Mastered React, responsive design principles, and modern front-end build pipelines.'
  },
  {
    id: '3',
    title: 'Google Data Analytics',
    issuer: 'Google',
    date: '2023-08-10',
    category: 'Data',
    imageUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',
    takeaway: 'Learned end-to-end analytics process from asking questions to driving decisions with data.'
  }
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState(initialCertificates);
  const [newCertificate, setNewCertificate] = useState({
    title: '',
    issuer: '',
    date: '',
    category: 'Development',
    imageUrl: '',
    takeaway: ''
  });
  const [isAddingCertificate, setIsAddingCertificate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const categories = ['Development', 'Data', 'Cloud', 'Design', 'Other'];
  
  const currentDate = new Date();
  const hours = currentDate.getHours();
  let greeting = "Evening";
  
  if (hours < 12) {
    greeting = "Morning";
  } else if (hours < 18) {
    greeting = "Afternoon";
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingId) {
      setCertificates(
        certificates.map((cert) =>
          cert.id === editingId ? { ...cert, [name]: value } : cert
        )
      );
    } else {
      setNewCertificate({ ...newCertificate, [name]: value });
    }
  };

  const handleAddCertificate = () => {
    // Simple validation
    if (!newCertificate.title || !newCertificate.issuer || !newCertificate.date) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    const certificate = {
      ...newCertificate,
      id: Date.now().toString(),
    };

    setCertificates([...certificates, certificate]);
    setNewCertificate({
      title: '',
      issuer: '',
      date: '',
      category: 'Development',
      imageUrl: '',
      takeaway: ''
    });
    setIsAddingCertificate(false);
    showNotification('Certificate published—nice one! It\'s now visible on your Certifications page.');
  };

  const handleEditCertificate = (id) => {
    setEditingId(id);
    const certificate = certificates.find((cert) => cert.id === id);
    setNewCertificate(certificate);
    setIsAddingCertificate(true);
  };

  const handleSaveEdit = () => {
    setCertificates(
      certificates.map((cert) =>
        cert.id === editingId ? { ...newCertificate } : cert
      )
    );
    setEditingId(null);
    setIsAddingCertificate(false);
    setNewCertificate({
      title: '',
      issuer: '',
      date: '',
      category: 'Development',
      imageUrl: '',
      takeaway: ''
    });
    showNotification('Certificate updated successfully');
  };

  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = () => {
    setCertificates(certificates.filter((cert) => cert.id !== confirmDelete));
    setConfirmDelete(null);
    showNotification('Certificate deleted successfully');
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <h1>{greeting}, {user?.name?.split(' ')[0] || 'Admin'} 👋</h1>
            <p className="dashboard-stats">
              {certificates.length} certificates, last updated {new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          <button 
            className="button"
            onClick={() => {
              setIsAddingCertificate(true);
              setEditingId(null);
              setNewCertificate({
                title: '',
                issuer: '',
                date: '',
                category: 'Development',
                imageUrl: '',
                takeaway: ''
              });
            }}
          >
            Upload new
          </button>
        </div>
        
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
        
        {confirmDelete && (
          <div className="confirm-dialog">
            <div className="confirm-dialog-content">
              <h3>Remove this certificate?</h3>
              <p>This action can't be undone, but you can always re-upload it later.</p>
              <div className="confirm-dialog-actions">
                <button onClick={handleCancelDelete} className="button outline">Cancel</button>
                <button onClick={handleConfirmDelete} className="button accent">Delete</button>
              </div>
            </div>
          </div>
        )}
        
        {isAddingCertificate ? (
          <div className="certificate-form-container">
            <h2>{editingId ? 'Edit Certificate' : 'Add New Certificate'}</h2>
            <div className="certificate-form">
              <div className="form-group">
                <label htmlFor="title">Certificate Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newCertificate.title}
                  onChange={handleInputChange}
                  placeholder="e.g., AWS Certified Solutions Architect"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="issuer">Issuing Organization*</label>
                <input
                  type="text"
                  id="issuer"
                  name="issuer"
                  value={newCertificate.issuer}
                  onChange={handleInputChange}
                  placeholder="e.g., Amazon Web Services"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="date">Date Received*</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newCertificate.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={newCertificate.category}
                  onChange={handleInputChange}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="imageUrl">Certificate Image URL</label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={newCertificate.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="takeaway">
                  Brief Takeaway <span className="char-count">{newCertificate.takeaway.length}/140</span>
                </label>
                <textarea
                  id="takeaway"
                  name="takeaway"
                  value={newCertificate.takeaway}
                  onChange={handleInputChange}
                  placeholder="What you learned (max 140 characters)"
                  maxLength={140}
                  rows={3}
                />
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  className="button outline"
                  onClick={() => {
                    setIsAddingCertificate(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={editingId ? handleSaveEdit : handleAddCertificate}
                >
                  {editingId ? 'Save Changes' : 'Add Certificate'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="certificates-container">
            {certificates.length === 0 ? (
              <div className="empty-state">
                <h3>You haven't uploaded any certificates yet.</h3>
                <p>Drag a PDF or image here, or click Browse to select a file.</p>
              </div>
            ) : (
              <div className="certificates-grid">
                {certificates.map((certificate) => (
                  <div className="certificate-card" key={certificate.id}>
                    <div className="certificate-image">
                      {certificate.imageUrl ? (
                        <img src={certificate.imageUrl} alt={certificate.title} />
                      ) : (
                        <div className="certificate-placeholder">
                          <span>No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="certificate-details">
                      <h3>{certificate.title}</h3>
                      <p className="certificate-issuer">{certificate.issuer}</p>
                      <p className="certificate-date">
                        {new Date(certificate.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <span className="certificate-category">{certificate.category}</span>
                      {certificate.takeaway && (
                        <p className="certificate-takeaway">{certificate.takeaway}</p>
                      )}
                    </div>
                    <div className="certificate-actions">
                      <button
                        className="icon-button edit-button"
                        onClick={() => handleEditCertificate(certificate.id)}
                        aria-label="Edit certificate"
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-button delete-button"
                        onClick={() => handleDeleteClick(certificate.id)}
                        aria-label="Delete certificate"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;