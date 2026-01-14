import React from "react";

interface TutorialProps {
  onFinish: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onFinish }) => {
  return (
    <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content rounded shadow-lg" style={{ overflow: 'hidden' }}>
          <div className="modal-header">
            <h5 className="modal-title fw-bold text-primary">How to Magic!</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onFinish}></button>
          </div>

          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="container-fluid">
              <div className="row align-items-center gx-3">
                <div className="col-12 col-md-6 mb-3 mb-md-0">
                  <div className="ratio ratio-16x9 rounded overflow-hidden border border-2 border-primary" style={{ maxHeight: 360 }}>
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-100 h-100"
                      style={{ objectFit: 'contain' }}
                      src="/videos/VayuLekha_App_Tutorial_Video.mp4"
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="p-3 bg-light rounded h-100 d-flex align-items-center">
                    <p className="mb-0 fw-bold text-center text-md-start">
                      Pinch your <strong>Thumb</strong> and <strong>Index finger</strong> together to draw or erase. Release to stop!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-primary btn-lg fw-bold" onClick={onFinish}>
              I'm Ready! Let's Go!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;