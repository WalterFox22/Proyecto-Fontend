import React from 'react';
import { Alert } from 'react-bootstrap';

const Mensaje = ({ children, tipo }) => {
    return (
        <Alert
            variant={tipo ? "success" : "danger"} // Determina el color según el tipo
            className="d-flex align-items-center mt-2 p-3 rounded border-0 shadow-sm"
        >
            <div className="me-3">
                {/* Ícono dinámico basado en el tipo */}
                {tipo ? (
                    <svg
                        className="w-5 h-5 text-success"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                ) : (
                    <svg
                        className="w-5 h-5 text-danger"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.366-1.01 1.752-1.01 2.118 0l.94 2.59a1 1 0 00.95.69h2.733c1.065 0 1.502 1.362.646 1.954l-2.21 1.543a1 1 0 00-.364 1.118l.94 2.59c.366 1.01-.855 1.847-1.732 1.236l-2.21-1.543a1 1 0 00-1.175 0l-2.21 1.543c-.877.61-2.098-.226-1.732-1.236l.94-2.59a1 1 0 00-.364-1.118L2.88 8.333c-.856-.592-.419-1.954.646-1.954h2.733a1 1 0 00.95-.69l.94-2.59z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
            </div>
            <div>
                <p className={`mb-0 fw-bold ${tipo ? 'text-success' : 'text-danger'}`}>
                    {children}
                </p>
            </div>
        </Alert>
    );
};

export default Mensaje;
