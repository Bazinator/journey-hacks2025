'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import styles from './page.module.css';
import { motion } from 'framer-motion';


export default function AccountPage() {
  const { userType } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userType === 'Restaurant' ? "Fresh Bites Restaurant" : "Local Food Bank",
    email: userType === 'Restaurant' ? "contact@freshbites.com" : "help@localfoodbank.org",
    phone: userType === 'Restaurant' ? "(555) 123-4567" : "(555) 987-6543",
    address: userType === 'Restaurant' ? "123 Main St, City" : "456 Oak Ave, City",
  });

  const [errors, setErrors] = useState({ email: "", phone: "", address: "" });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^(\(\d{3}\)\s?)?\d{3}[-.\s]?\d{4}$/;
    return phoneRegex.test(phone);
  };
  
  

  const validateAddress = (address) => {
    return address.length > 5; // Basic check to ensure it's not too short
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate field and update error state
    if (name === "email") {
      setErrors({ ...errors, email: validateEmail(value) ? "" : "Invalid email format" });
    }
    if (name === "phone") {
      setErrors({ ...errors, phone: validatePhone(value) ? "" : "Invalid phone format (e.g. (555) 123-4567)" });
    }
    if (name === "address") {
      setErrors({ ...errors, address: validateAddress(value) ? "" : "Address is too short" });
    }
  };

  const isFormValid = () => {
    return validateEmail(formData.email) && validatePhone(formData.phone) && validateAddress(formData.address);
  };
  
  // This will be replaced with actual data from the backend
  const accountData = {
    restaurant: {
      name: "Fresh Bites Restaurant",
      email: "contact@freshbites.com",
      address: "123 Main St, City",
      phone: "(555) 123-4567",
      description: "Family-owned restaurant specializing in fresh, local ingredients",
      operatingHours: "Mon-Sat: 11:00 AM - 10:00 PM",
      preferredPickupTimes: "2:00 PM - 4:00 PM"
    },
    charity: {
      name: "Local Food Bank",
      email: "help@localfoodbank.org",
      address: "456 Oak Ave, City",
      phone: "(555) 987-6543",
      description: "Non-profit organization helping to feed local communities",
      serviceArea: "Within 10 miles of city center",
      storageCapacity: "500 sq ft of refrigerated storage"
    }
  };

  const data = userType === 'Restaurant' ? accountData.restaurant : accountData.charity;
  const hasErrors = Object.values(errors).some((error) => error);


  return (
    <div className={styles.accountPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Account Settings</h1>
        <motion.div layout className={styles.buttonWrapper}>
        <motion.button 
          className={styles.saveButton} 
          onClick={() => setIsEditing(!isEditing)}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          disabled={isEditing && hasErrors} // 🔥 Disables when there are errors
        >
          <motion.span
            key={isEditing ? "save" : "edit"}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, y: 5 }}
          >
            {isEditing ? "Save Changes" : "Edit"}
          </motion.span>
        </motion.button>
        </motion.div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile Information</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Organization Name</label>
              <input
                type="text"
                className={styles.input}
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={`${styles.input} ${errors.email && styles.error}`}
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
              {errors.email && <p className={styles.errorText}>{errors.email}</p>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="tel"
                className={`${styles.input} ${errors.phone && styles.error}`}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
              {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Address</label>
              <input
                type="text"
                className={`${styles.input} ${errors.address && styles.error}`}
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
              {errors.address && <p className={styles.errorText}>{errors.address}</p>}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Organization Details</h2>
          <div className={styles.formGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              defaultValue={data.description}
              rows={4}
              disabled={!isEditing} // Disable when not in edit mode
            />
          </div>
          
          {userType === 'Restaurant' ? (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Operating Hours</label>
                <input
                  type="text"
                  className={styles.input}
                  defaultValue={data.operatingHours}
                  disabled={!isEditing} // Disable when not in edit mode
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Preferred Pickup Times</label>
                <input
                  type="text"
                  className={styles.input}
                  defaultValue={data.preferredPickupTimes}
                  disabled={!isEditing} // Disable when not in edit mode
                />
              </div>
            </>
          ) : (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Service Area</label>
                <input
                  type="text"
                  className={styles.input}
                  defaultValue={data.serviceArea}
                  disabled={!isEditing} // Disable when not in edit mode
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Storage Capacity</label>
                <input
                  type="text"
                  className={styles.input}
                  defaultValue={data.storageCapacity}
                  disabled={!isEditing} // Disable when not in edit mode
                />
              </div>
            </>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Security</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Current Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Enter current password"
                disabled={!isEditing} // Disable when not in edit mode
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>New Password</label>
              <input
                type="password"
                className={styles.input}
                placeholder="Enter new password"
                disabled={!isEditing} // Disable when not in edit mode
              />
            </div>
          </div>
        </div>

        <div className={styles.dangerZone}>
          <h2 className={styles.dangerTitle}>Danger Zone</h2>
          <button className={styles.deleteButton}>Delete Account</button>
        </div>
      </div>
    </div>
  );
} 