
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Logo } from '../constants';

interface ProfileFormProps {
  onComplete: (profile: UserProfile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please type your name to practice!');
      return;
    }
    if (phone.length !== 10) {
      setError('Enter 10 numbers for your family contact!');
      return;
    }
    onComplete({ name, phone });
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center p-3 p-md-5 font-['Quicksand']">
      <div className="bg-white p-4 p-md-5 rounded-[3.5rem] shadow-2xl w-100 border-t-8 border-[#7D3E98] animate-in fade-in slide-in-from-bottom-20 duration-1000" style={{ maxWidth: '520px' }}>
        <div className="mb-4 text-center">
           <Logo className="w-24 h-24 mx-auto" showText={false} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight text-center">Practice Pad</h2>
        <p className="text-lg text-slate-500 mb-4 font-bold leading-relaxed text-center">Let's practice your name and family number so you always know them!</p>

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12">
            <label className="form-label small text-uppercase fw-bold">My Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control form-control-lg rounded-[2rem] text-xl font-bold"
              placeholder="Type your name..."
            />
          </div>

          <div className="col-12">
            <label className="form-label small text-uppercase fw-bold">My Family Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="form-control form-control-lg rounded-[2rem] text-xl font-bold"
              placeholder="10 Magic Numbers"
            />
          </div>

          {error && <div className="col-12"><p className="text-rose-500 font-black text-center mb-0">{error}</p></div>}

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 fw-bold rounded-[1rem] shadow-2xl"
            >
              Start Practice Studio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
