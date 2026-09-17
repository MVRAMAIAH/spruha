/**
 * Andhra Pradesh Districts Master Data
 * 
 * DATA CATEGORY: REFERENCE (sourced from official AP district structure)
 * NOTE: This will be replaced with verified data from the user's master dataset.
 * 
 * 26 districts as per post-2022 reorganization of Andhra Pradesh
 */

export const AP_STATE = {
  id: 'state-ap',
  name: 'Andhra Pradesh',
  code: 'AP',
};

export const DISTRICTS = [
  { id: 'dist-01', name: 'Alluri Sitharama Raju', stateId: 'state-ap' },
  { id: 'dist-02', name: 'Anakapalli', stateId: 'state-ap' },
  { id: 'dist-03', name: 'Ananthapuramu', stateId: 'state-ap' },
  { id: 'dist-04', name: 'Annamayya', stateId: 'state-ap' },
  { id: 'dist-05', name: 'Bapatla', stateId: 'state-ap' },
  { id: 'dist-06', name: 'Chittoor', stateId: 'state-ap' },
  { id: 'dist-07', name: 'East Godavari', stateId: 'state-ap' },
  { id: 'dist-08', name: 'Eluru', stateId: 'state-ap' },
  { id: 'dist-09', name: 'Guntur', stateId: 'state-ap' },
  { id: 'dist-10', name: 'Kakinada', stateId: 'state-ap' },
  { id: 'dist-11', name: 'Konaseema', stateId: 'state-ap' },
  { id: 'dist-12', name: 'Krishna', stateId: 'state-ap' },
  { id: 'dist-13', name: 'Kurnool', stateId: 'state-ap' },
  { id: 'dist-14', name: 'Nandyal', stateId: 'state-ap' },
  { id: 'dist-15', name: 'NTR', stateId: 'state-ap' },
  { id: 'dist-16', name: 'Palnadu', stateId: 'state-ap' },
  { id: 'dist-17', name: 'Parvathipuram Manyam', stateId: 'state-ap' },
  { id: 'dist-18', name: 'Prakasam', stateId: 'state-ap' },
  { id: 'dist-19', name: 'Polavaram', stateId: 'state-ap' },
  { id: 'dist-20', name: 'Sri Potti Sriramulu Nellore', stateId: 'state-ap' },
  { id: 'dist-21', name: 'Sri Sathya Sai', stateId: 'state-ap' },
  { id: 'dist-22', name: 'Srikakulam', stateId: 'state-ap' },
  { id: 'dist-23', name: 'Tirupati', stateId: 'state-ap' },
  { id: 'dist-24', name: 'Visakhapatnam', stateId: 'state-ap' },
  { id: 'dist-25', name: 'West Godavari', stateId: 'state-ap' },
  { id: 'dist-26', name: 'YSR Kadapa', stateId: 'state-ap' },
];

export const getDistrictById = (id) => DISTRICTS.find(d => d.id === id);
export const getDistrictsByState = (stateId) => DISTRICTS.filter(d => d.stateId === stateId);
