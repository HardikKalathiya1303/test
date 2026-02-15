'use client';

import { useState, useEffect } from 'react';
import { getCountries, getStates, getCities } from '@/services/location.service';
import Select from '@/components/ui/Select';

export default function LocationSelector({
  country,
  state,
  city,
  onCountryChange,
  onStateChange,
  onCityChange,
  errors = {},
  disabled = false,
}) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState({ countries: true, states: false, cities: false });

  // Load countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await getCountries();
        if (response.success) {
          setCountries(response.data);
        }
      } catch (error) {
        console.error('Failed to load countries:', error);
      } finally {
        setLoading(prev => ({ ...prev, countries: false }));
      }
    };
    fetchCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (country) {
      const fetchStates = async () => {
        setLoading(prev => ({ ...prev, states: true }));
        try {
          const response = await getStates(country);
          if (response.success) {
            setStates(response.data);
          }
        } catch (error) {
          console.error('Failed to load states:', error);
        } finally {
          setLoading(prev => ({ ...prev, states: false }));
        }
      };
      fetchStates();
    } else {
      setStates([]);
    }
  }, [country]);

  // Load cities when state changes
  useEffect(() => {
    if (state) {
      const fetchCities = async () => {
        setLoading(prev => ({ ...prev, cities: true }));
        try {
          const response = await getCities(state);
          if (response.success) {
            setCities(response.data);
          }
        } catch (error) {
          console.error('Failed to load cities:', error);
        } finally {
          setLoading(prev => ({ ...prev, cities: false }));
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
  }, [state]);

  const handleCountryChange = (e) => {
    onCountryChange(e.target.value);
    onStateChange('');
    onCityChange('');
    setStates([]);
    setCities([]);
  };

  const handleStateChange = (e) => {
    onStateChange(e.target.value);
    onCityChange('');
    setCities([]);
  };

  const handleCityChange = (e) => {
    onCityChange(e.target.value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Select
        label="Country"
        value={country}
        onChange={handleCountryChange}
        options={countries.map(c => ({ value: c.id, label: c.name }))}
        placeholder={loading.countries ? 'Loading...' : 'Select Country'}
        error={errors.country}
        disabled={disabled || loading.countries}
      />
      
      <Select
        label="State"
        value={state}
        onChange={handleStateChange}
        options={states.map(s => ({ value: s.id, label: s.name }))}
        placeholder={loading.states ? 'Loading...' : 'Select State'}
        error={errors.state}
        disabled={disabled || !country || loading.states}
      />
      
      <Select
        label="City"
        value={city}
        onChange={handleCityChange}
        options={cities.map(c => ({ value: c.id, label: c.name }))}
        placeholder={loading.cities ? 'Loading...' : 'Select City'}
        error={errors.city}
        disabled={disabled || !state || loading.cities}
      />
    </div>
  );
}
