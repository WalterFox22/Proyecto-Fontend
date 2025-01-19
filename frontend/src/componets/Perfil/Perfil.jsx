import React, { useContext } from 'react';
import AuthContext from '../../context/AuthProvider'; // Importa el contexto

const Perfil = () => {
    const { auth } = useContext(AuthContext);

    return (
        <>
            <div>
                <h1 className="font-black text-4xl text-gray-500">Perfil</h1>
                <hr className="my-4" />
                <p className="mb-8">
                    Este módulo te permite visualizar y actualizar el perfil del Administrador
                </p>
            </div>

            <div className="flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap">
                <div className="w-full md:w-1/2">
                    <h2 className="text-2xl font-bold">Información del Perfil</h2>
                    {auth.nombre ? (
                        <div>
                            <p>Nombre: {auth.nombre}</p>
                            <p>Email: {auth.email}</p>
                        </div>
                    ) : (
                        <p>Cargando datos del perfil...</p>
                    )}
                </div>
                <div className="w-full md:w-1/2">
                    <h2 className="text-2xl font-bold">Opciones</h2>
                    <p>Aquí puedes actualizar tu perfil.</p>
                </div>
            </div>
        </>
    );
};

export default Perfil;
