"use client";

import React, { useState, useEffect } from "react";
import { FaClipboardList, FaCheckCircle, FaClock, FaTimesCircle, FaUsers } from "react-icons/fa";
import { getDoctorStatistics } from "@/services/api/doctorService";

interface StatisticsData {
  today: {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
  };
  lastMonth: {
    total: number;
    uniquePatients: number;
  };
}

interface DoctorDashboardProps {
  doctorId: string;
  accessToken: string;
  initialStatistics: StatisticsData;
}

export default function DoctorDashboard({
  doctorId,
  accessToken,
  initialStatistics,
}: DoctorDashboardProps) {
  const [statistics, setStatistics] = useState<StatisticsData>(initialStatistics);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Refresh statistics every 30 seconds
    const interval = setInterval(() => {
      refreshStatistics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const refreshStatistics = async () => {
    try {
      setLoading(true);
      const data = await getDoctorStatistics(doctorId, accessToken);
      setStatistics(data.statistics);
    } catch (error) {
      console.error("Error refreshing statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    Icon,
    title,
    value,
    color,
  }: {
    Icon: React.ComponentType<{ className?: string }>; // ✅ Tipo correcto
    title: string;
    value: number;
    color: string;
  }) => (
    <div className='card flex items-center gap-4 p-2'>
      <div
        className={`${color} hidden  flex-shrink-0 sm:flex items-center justify-center w-10 h-10 rounded-lg text-white`}
      >
        <Icon /> {/* ✅ Cambiar de icon a Icon (mayúscula) */}
      </div>
      <div className='flex-1'>
        <p className='text-gray-600 text-xs font-semibold'>{title}</p>
        <p className='text-2xl font-bold text-primary'>{value}</p>
      </div>
    </div>
  );

  return (
    <div className='mb-12'>
      {/* Today's Statistics */}
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-sm sm:text-xl font-bold text-darker'>Estadísticas de Hoy</h2>
          <button
            onClick={refreshStatistics}
            disabled={loading}
            className='btn-secondary px-2 py-2 disabled:opacity-50'
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4'>
          <StatCard
            Icon={FaClipboardList}
            title='Total de Citas'
            value={statistics.today.total}
            color='bg-primary'
          />
          <StatCard
            Icon={FaCheckCircle}
            title='Completadas'
            value={statistics.today.completed}
            color='bg-green-500' // ✅ Cambiar de bg-success
          />
          <StatCard
            Icon={FaClock}
            title='Pendientes'
            value={statistics.today.pending}
            color='bg-yellow-500' // ✅ Cambiar de bg-warning
          />
          <StatCard
            Icon={FaTimesCircle}
            title='Canceladas'
            value={statistics.today.cancelled}
            color='bg-red-500' // ✅ Cambiar de bg-error
          />
        </div>
      </div>

      {/* This Month's Statistics */}
      <div>
        <h2 className='text-xl font-bold text-darker mb-4'>Estadísticas del Mes</h2>
        <div className='grid grid-cols-2 gap-4'>
          <div className='card'>
            <div className='flex items-center gap-4'>
              <div
                style={{ backgroundColor: "var(--color-primary)" }}
                className='hidden sm:flex p-4 rounded-lg text-white text-xl'
              >
                <FaClipboardList />
              </div>
              <div>
                <p className='text-gray-600 text-sm font-semibold'>Total de Citas</p>
                <p className='text-3xl font-bold text-primary'>{statistics.lastMonth.total}</p>
              </div>
            </div>
          </div>
          <div className='card'>
            <div className='flex items-center gap-4'>
              <div
                style={{ backgroundColor: "var(--color-success)" }}
                className='hidden sm:flex p-4 rounded-lg text-white text-xl'
              >
                <FaUsers />
              </div>
              <div>
                <p className='text-gray-600 text-sm font-semibold'>Pacientes Únicos</p>
                <p className='text-3xl font-bold text-primary'>
                  {statistics.lastMonth.uniquePatients}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
