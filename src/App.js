import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    streetName: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const fetchAddresses = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/addresses");
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };
  const handleModalOpen = () => {
    setShowModal(true);
  };
  const handleAddAddress = async () => {
    try {
      console.log("Adding address:", formData);

      await axios.post("http://localhost:3001/api/addresses", formData);

      console.log("Address added successfully");
      fetchAddresses();
      handleCloseModal();
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleEditAddress = (address) => {
    setShowModal(true);
    setFormData(address);
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/addresses/${id}`);
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      streetName: "",
      city: "",
      state: "",
      zipCode: "",
    });
  };

  const handleSubmit = async () => {
    try {
      if (formData._id) {
        // Update existing address
        await axios.put(
          `http://localhost:3001/api/addresses/${formData._id}`,
          formData
        );
      } else {
        // Add new address
        await handleAddAddress();
      }

      fetchAddresses();
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div>
      <button onClick={handleModalOpen}>Add Address</button>
      <hr />
      <div>
        <h2>Addresses List</h2>
        <table>
          <thead>
            <tr>
              <th>Street Name</th>
              <th>City</th>
              <th>State</th>
              <th>Zip Code</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((address) => (
              <tr key={address._id}>
                <td>{address.streetName}</td>
                <td>{address.city}</td>
                <td>{address.state}</td>
                <td>{address.zipCode}</td>
                <td>
                  <button onClick={() => handleEditAddress(address)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDeleteAddress(address._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <form>
              <label>Street Name</label>
              <input
                type="text"
                value={formData.streetName}
                onChange={(e) =>
                  setFormData({ ...formData, streetName: e.target.value })
                }
                required
              />
              <label>City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />
              <label>State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                required
              />
              <label>Zip Code</label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                required
              />
              <div>
                <button type="button" onSubmit={handleSubmit}>
                  Submit
                </button>
                <button type="button" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
