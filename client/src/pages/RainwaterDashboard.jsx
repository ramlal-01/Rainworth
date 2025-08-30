import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { GlobeAltIcon, HomeIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RainwaterDashboard = () => {
  const [data, setData] = useState(null);
  const [projectInputs, setProjectInputs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const { projectId } = useParams();
  const statCardsRef = useRef([]);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        if (!projectId) {
          // If no projectId, show demo data
          setData({
            location: 'Demo Location',
            reportDate: new Date().toLocaleDateString(),
            reportId: 'DEMO-001',
            sustainability: 9.6,
            stats: {
              totalHarvested: 145000,
              perPersonPotential: 36250,
              sustainability: 9.6,
              annualRequirement: 180000,
              tankSize: 5000,
              cost: 75000,
              roofType: 'Concrete',
              waterStored: 4800,
              rechargePits: 2
            },
            costBreakdown: {
              tankInstallation: 45000,
              filtration: 15000,
              pipingLabor: 15000,
              paybackPeriod: 3.5
            },
            rainfallData: [22, 16, 13, 7, 19, 105, 315, 300, 195, 32, 5, 8],
            harvestedData: [17.6, 12.8, 10.4, 5.6, 15.2, 84, 252, 240, 156, 25.6, 4, 6.4],
            demandData: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
            surplusData: [2.6, -2.2, -4.6, -9.4, 0.2, 69, 237, 225, 141, 10.6, -11, -8.6]
          });
          
          // Demo project inputs for PDF
          setProjectInputs({
            name: 'Demo Rainwater Harvesting Project',
            location: 'Demo Location, Mumbai',
            residenceType: 'Independent House',
            numberOfDwellers: 4,
            numberOfFlats: 1,
            openSpaceArea: 100,
            roofType: 'Concrete',
            roofArea: 150
          });
          
          setLoading(false);
          return;
        }

        // Fetch project details
        const projectResponse = await fetch(`/api/projects/${projectId}`);
        if (!projectResponse.ok) {
          throw new Error('Failed to fetch project details');
        }
        const project = await projectResponse.json();
        
        // Store project inputs for PDF
        setProjectInputs({
          name: project.name,
          location: project.location,
          residenceType: project.residenceType === 'house' ? 'Independent House' : 
                        project.residenceType === 'apartment_individual' ? 'Apartment (Individual)' :
                        project.residenceType === 'apartment_building' ? 'Apartment (Building)' :
                        project.residenceType,
          numberOfDwellers: project.numberOfDwellers,
          numberOfFlats: project.numberOfFlats,
          openSpaceArea: project.openSpaceArea,
          roofType: project.roofType,
          roofArea: project.roofArea
        });

        // Fetch calculation data
        const calcResponse = await fetch(`/api/projects/${projectId}/calculation`);
        if (!calcResponse.ok) {
          throw new Error('Failed to fetch calculation data');
        }
        const calculation = await calcResponse.json();

        // Transform data for dashboard
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        
        // Handle MongoDB Map objects - convert to regular objects if needed
        const rainfallMap = calculation.monthlyRainfall instanceof Map ? Object.fromEntries(calculation.monthlyRainfall) : calculation.monthlyRainfall;
        const harvestMap = calculation.monthlyHarvest instanceof Map ? Object.fromEntries(calculation.monthlyHarvest) : calculation.monthlyHarvest;
        const consumptionMap = calculation.monthlyConsumption instanceof Map ? Object.fromEntries(calculation.monthlyConsumption) : calculation.monthlyConsumption;
        const surplusMap = calculation.monthlySurplus instanceof Map ? Object.fromEntries(calculation.monthlySurplus) : calculation.monthlySurplus;
        
        const rainfallData = months.map(month => rainfallMap[month] || 0);
        const harvestedData = months.map(month => harvestMap[month] || 0);
        const demandData = months.map(month => consumptionMap[month] || 0);
        const surplusData = months.map(month => surplusMap[month] || 0);

        setData({
          location: project.location,
          reportDate: new Date().toLocaleDateString(),
          reportId: `RH-${projectId.slice(-6)}`,
          sustainability: Math.min(12, ((calculation.annualHarvest / calculation.annualConsumption) * 12)).toFixed(1),
          stats: {
            totalHarvested: Math.round(calculation.annualHarvest),
            perPersonPotential: Math.round(calculation.annualHarvest / project.numberOfDwellers),
            sustainability: Math.min(12, ((calculation.annualHarvest / calculation.annualConsumption) * 12)).toFixed(1),
            annualRequirement: Math.round(calculation.annualConsumption),
            tankSize: 5000,
            cost: calculation.structureCost,
            roofType: project.roofType,
            waterStored: Math.min(5000, calculation.annualHarvest),
            rechargePits: calculation.rechargeFrequency
          },
          costBreakdown: {
            tankInstallation: Math.round(calculation.structureCost * 0.6),
            filtration: Math.round(calculation.structureCost * 0.2),
            pipingLabor: Math.round(calculation.structureCost * 0.2),
            paybackPeriod: (calculation.structureCost / (calculation.annualHarvest * 0.05)).toFixed(1)
          },
          rainfallData,
          harvestedData,
          demandData,
          surplusData
        });

      } catch (err) {
        console.error('Error fetching project data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  // Generate and download PDF report
  const handleDownloadReport = async () => {
    if (!data || !projectInputs) {
      alert('Please wait for data to load completely before downloading the report.');
      return;
    }

    try {
      setDownloadLoading(true);
      
      // Create PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Helper function to check if we need a new page
      const checkPageBreak = (requiredSpace) => {
        if (yPosition + requiredSpace > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
      };

      // 1. HEADER SECTION
      pdf.setFillColor(59, 130, 246); // Blue color
      pdf.rect(0, 0, pageWidth, 35, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.setFont(undefined, 'bold');
      pdf.text('Rainwater Harvesting Analysis Report', 20, 22);
      
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      
      yPosition = 50;

      // 2. PROJECT INPUT DATA SECTION
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(18);
      pdf.setFont(undefined, 'bold');
      pdf.text('Project Input Information', 20, yPosition);
      yPosition += 8;

      // Draw line under heading
      pdf.setDrawColor(59, 130, 246);
      pdf.setLineWidth(0.8);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 15;

      // Input data table
      const inputData = [
        ['Project Name:', projectInputs.name],
        ['Location:', projectInputs.location],
        ['Residence Type:', projectInputs.residenceType],
        ['Number of Dwellers:', projectInputs.numberOfDwellers.toString()],
        ['Number of Flats:', projectInputs.numberOfFlats.toString()],
        ['Open Space Area:', `${projectInputs.openSpaceArea} m²`],
        ['Roof Type:', projectInputs.roofType],
        ['Roof Area:', `${projectInputs.roofArea} m²`]
      ];

      pdf.setFontSize(12);
      inputData.forEach(([label, value]) => {
        checkPageBreak(10);
        pdf.setFont(undefined, 'bold');
        pdf.text(label, 25, yPosition);
        pdf.setFont(undefined, 'normal');
        pdf.text(value, 90, yPosition);
        yPosition += 8;
      });

      yPosition += 15;

      // 3. ANALYSIS RESULTS SECTION
      checkPageBreak(25);
      pdf.setFontSize(18);
      pdf.setFont(undefined, 'bold');
      pdf.text('Analysis Results & Output', 20, yPosition);
      yPosition += 8;

      pdf.setDrawColor(59, 130, 246);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 15;

      // Key Statistics
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text('Key Statistics', 25, yPosition);
      yPosition += 12;

      const keyStats = [
        ['Total Water Harvested (Annual):', `${data.stats.totalHarvested.toLocaleString()} L`],
        ['Per Person Water Potential:', `${data.stats.perPersonPotential.toLocaleString()} L/year`],
        ['Water Sustainability:', `${data.stats.sustainability} months/year`],
        ['Annual Water Requirement:', `${data.stats.annualRequirement.toLocaleString()} L`],
        ['Recommended Tank Size:', `${data.stats.tankSize.toLocaleString()} L`],
        ['Water Storage Capacity:', `${Math.round(data.stats.waterStored).toLocaleString()} L`],
        ['Recharge Pits Required:', `${data.stats.rechargePits} pits`]
      ];

      pdf.setFontSize(11);
      keyStats.forEach(([label, value]) => {
        checkPageBreak(8);
        pdf.setFont(undefined, 'bold');
        pdf.text(label, 30, yPosition);
        pdf.setFont(undefined, 'normal');
        pdf.text(value, 130, yPosition);
        yPosition += 7;
      });

      yPosition += 15;

      // Cost Analysis
      checkPageBreak(30);
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text('Cost Analysis', 25, yPosition);
      yPosition += 12;

      const costData = [
        ['Tank & Installation:', `₹${data.costBreakdown.tankInstallation.toLocaleString()}`],
        ['Filtration System:', `₹${data.costBreakdown.filtration.toLocaleString()}`],
        ['Piping & Labor:', `₹${data.costBreakdown.pipingLabor.toLocaleString()}`],
        ['Payback Period:', `${data.costBreakdown.paybackPeriod} years`]
      ];

      pdf.setFontSize(11);
      costData.forEach(([label, value]) => {
        checkPageBreak(8);
        pdf.setFont(undefined, 'normal');
        pdf.text(label, 30, yPosition);
        pdf.text(value, 130, yPosition);
        yPosition += 7;
      });

      // Total cost with highlight
      checkPageBreak(15);
      yPosition += 3;
      pdf.setDrawColor(0, 0, 0);
      pdf.line(30, yPosition, 170, yPosition);
      yPosition += 8;
      
      pdf.setFont(undefined, 'bold');
      pdf.setFontSize(13);
      pdf.text('Total Estimated Cost:', 30, yPosition);
      pdf.setTextColor(59, 130, 246);
      pdf.text(`₹${data.stats.cost.toLocaleString()}`, 130, yPosition);
      pdf.setTextColor(0, 0, 0);
      yPosition += 15;

      // 4. MONTHLY ANALYSIS TABLE
      checkPageBreak(100);
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text('Monthly Water Analysis', 25, yPosition);
      yPosition += 15;

      // Table headers
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'bold');
      const headers = ['Month', 'Rainfall', 'Harvest', 'Demand', 'Surplus'];
      const colWidths = [25, 30, 30, 30, 30];
      const colPositions = [25, 50, 80, 110, 140];
      
      headers.forEach((header, i) => {
        pdf.text(header, colPositions[i], yPosition);
      });
      
      yPosition += 3;
      pdf.line(25, yPosition, 170, yPosition);
      yPosition += 8;

      // Table data
      pdf.setFont(undefined, 'normal');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      months.forEach((month, index) => {
        checkPageBreak(8);
        const rowData = [
          month,
          `${data.rainfallData[index]?.toFixed(1) || '0'} mm`,
          `${Math.round(data.harvestedData[index] || 0).toLocaleString()} L`,
          `${Math.round(data.demandData[index] || 0).toLocaleString()} L`,
          `${Math.round(data.surplusData[index] || 0).toLocaleString()} L`
        ];
        
        rowData.forEach((cell, i) => {
          pdf.text(cell, colPositions[i], yPosition);
        });
        yPosition += 6;
      });

      yPosition += 15;

      // 5. SUMMARY & RECOMMENDATIONS
      checkPageBreak(40);
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text('Summary & Recommendations', 25, yPosition);
      yPosition += 8;

      pdf.setDrawColor(59, 130, 246);
      pdf.line(25, yPosition, pageWidth - 20, yPosition);
      yPosition += 12;

      const recommendations = [
        `• Your property can harvest approximately ${data.stats.totalHarvested.toLocaleString()} liters of water annually.`,
        `• This system can meet your water needs for ${data.stats.sustainability} months per year.`,
        `• Recommended tank capacity: ${data.stats.tankSize.toLocaleString()} liters with ${data.stats.rechargePits} recharge pits.`,
        `• Total investment required: ₹${data.stats.cost.toLocaleString()} with payback in ${data.costBreakdown.paybackPeriod} years.`,
        `• This system will provide ${data.stats.perPersonPotential.toLocaleString()} liters per person annually.`
      ];

      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');
      recommendations.forEach(text => {
        checkPageBreak(15);
        const lines = pdf.splitTextToSize(text, pageWidth - 60);
        pdf.text(lines, 30, yPosition);
        yPosition += lines.length * 6 + 3;
      });

      // 6. FOOTER
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10);
        pdf.text('RainWorth - Rainwater Harvesting Analysis Tool', 20, pageHeight - 10);
      }

      // Save the PDF
      const fileName = projectId ? 
        `rainwater-report-${projectId.slice(-6)}.pdf` : 
        'rainwater-demo-report.pdf';
      
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      // Initialize animations after data loads
      const handleScroll = () => {
        statCardsRef.current.forEach((card, index) => {
          if (!card) return;
          
          const cardPosition = card.getBoundingClientRect().top;
          const screenPosition = window.innerHeight / 1.3;
          
          if (cardPosition < screenPosition) {
            setTimeout(() => {
              card.style.opacity = 1;
              card.style.transform = 'translateY(0)';
            }, index * 100);
          }
        });
      };

      // Initialize card styles
      statCardsRef.current.forEach(card => {
        if (card) {
          card.style.opacity = 0;
          card.style.transform = 'translateY(20px)';
          card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        }
      });

      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial position

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500 mx-auto"></div>
          <h2 className="text-2xl font-semibold mt-4 text-gray-600">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold mt-4 text-gray-600">Error Loading Dashboard</h2>
          <p className="text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Chart data preparation
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Chart 1: Rainfall vs Harvest
  const rainfallHarvestChartData = {
    labels: months,
    datasets: [
      {
        label: 'Rainfall (mm)',
        data: data.rainfallData,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: 'Harvest (L)',
        data: data.harvestedData,
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
      },
    ],
  };

  // Chart 2: Consumption vs Surplus
  const consumeSurplusChartData = {
    labels: months,
    datasets: [
      {
        label: 'Consumption (L)',
        data: data.demandData,
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
      {
        label: 'Surplus (L)',
        data: data.surplusData,
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions1 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Rainfall vs Water Harvest',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Rainfall (mm)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Harvest (L)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const chartOptions2 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Water Consumption vs Surplus',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Water (L)',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 font-sans">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-10 p-6 bg-white rounded-2xl shadow-md max-w-7xl mx-auto mt-8">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-20"></div>
            <i className="fas fa-tint text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Rainwater Harvesting Analysis</h1>
            <p className="text-gray-500">Detailed report for your location</p>
          </div>
        </div>
        <nav className="flex items-center space-x-6">
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex justify-center items-center rounded-full border border-transparent px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200 shadow-sm"
            >
              <GlobeAltIcon className="h-5 w-5 mr-2 text-white" />
              {isEnglish ? 'English' : 'हिंदी'}
            </button>
          </div>
          <a href="/reports" className="text-gray-600 hover:text-blue-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">Reports</a>
          <Link
            to="/"
            className="inline-flex justify-center items-center rounded-full border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 text-gray-700"
          >
            <HomeIcon className="h-5 w-5 mr-2 text-gray-500" />
            {isEnglish ? 'Home' : 'होम'}
          </Link>
          {isAuthenticated() ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-sm">Welcome, {user?.name}</span>
              <button 
                onClick={handleLogout}
                className="inline-flex justify-center items-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 text-gray-500" />
                {isEnglish ? 'Logout' : 'लॉगआउट'}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex justify-center items-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <i className="fas fa-user-circle mr-2"></i>
              {isEnglish ? 'Login' : 'लॉगिन'}
            </Link>
          )}
        </nav>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Location & Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{data.location}</h2>
              <p className="text-gray-500">Residential Property • {data.stats.roofType} Roof • {data.stats.totalHarvested > 0 ? Math.round(data.stats.totalHarvested / data.stats.perPersonPotential) : 'N/A'} Dwellers</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Report generated:</span>
                <span className="text-gray-700 font-medium">{data.reportDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Report ID:</span>
                <span className="text-gray-700 font-medium">{data.reportId}</span>
              </div>
            </div>
          </div>
          

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Stat Card 1 */}
          <div ref={el => statCardsRef.current[0] = el} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border border-blue-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Total Harvested Water</h3>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-tint text-white text-lg"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">{data.stats.totalHarvested.toLocaleString()}</p>
            <p className="text-sm text-blue-600 font-medium">Liters per year</p>
          </div>
          
          {/* Stat Card 2 */}
          <div ref={el => statCardsRef.current[1] = el} className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl shadow-lg p-6 border border-teal-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-teal-700 uppercase tracking-wide">Per Person Potential</h3>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-users text-white text-lg"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">{data.stats.perPersonPotential.toLocaleString()}</p>
            <p className="text-sm text-teal-600 font-medium">Liters per year</p>
          </div>
          

          
          {/* Stat Card 3 */}
          <div ref={el => statCardsRef.current[2] = el} className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg p-6 border border-red-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wide">Annual Requirement</h3>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-bullseye text-white text-lg"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">{data.stats.annualRequirement.toLocaleString()}</p>
            <p className="text-sm text-red-600 font-medium">Liters per year</p>
          </div>
          
          {/* Stat Card 4 */}
          <div ref={el => statCardsRef.current[3] = el} className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-6 border border-purple-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Tank Size</h3>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-archive text-white text-lg"></i>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">{data.stats.tankSize.toLocaleString()}</p>
            <p className="text-sm text-purple-600 font-medium">Liters recommended</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Rainfall vs Harvested Water Chart */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl border border-blue-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Rainfall vs. Harvested Water</h3>
                <p className="text-sm text-gray-600">Monthly comparison of rainfall and water collection</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full font-medium">Monthly Data</span>
              </div>
            </div>
            <div className="h-80 bg-white rounded-xl p-4 shadow-inner">
              <Bar data={rainfallHarvestChartData} options={chartOptions1} />
            </div>
          </div>
          
          {/* Demand vs Supply Chart */}
          <div className="bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl border border-amber-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Demand vs. Supply</h3>
                <p className="text-sm text-gray-600">Monthly water demand versus harvested supply</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs px-3 py-1.5 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 rounded-full font-medium">Monthly Data</span>
              </div>
            </div>
            <div className="h-80 bg-white rounded-xl p-4 shadow-inner">
              <Bar data={consumeSurplusChartData} options={chartOptions2} />
            </div>
          </div>
        </div>

        {/* Additional Info & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Cost Breakdown */}
          <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-xl p-8 lg:col-span-1 border border-green-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg mr-4">
                <i className="fas fa-rupee-sign text-white text-lg"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Cost Analysis</h3>
            </div>
            <div className="space-y-5">
              <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                <span className="text-gray-700 font-medium">Tank & Installation</span>
                <span className="font-bold text-gray-800">₹{data.costBreakdown.tankInstallation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                <span className="text-gray-700 font-medium">Filtration System</span>
                <span className="font-bold text-gray-800">₹{data.costBreakdown.filtration.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                <span className="text-gray-700 font-medium">Piping & Labor</span>
                <span className="font-bold text-gray-800">₹{data.costBreakdown.pipingLabor.toLocaleString()}</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4"></div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-xl shadow-sm">
                <span className="text-green-800 font-bold text-lg">Total Investment</span>
                <span className="font-bold text-green-700 text-xl">₹{data.stats.cost.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-blue-700 font-semibold">Payback Period</span>
                <span className="font-bold text-blue-800">{data.costBreakdown.paybackPeriod} years</span>
              </div>
              <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 shadow-sm" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-blue-600 mt-2">Expected return on investment</p>
            </div>
          </div>
          
          {/* System Details */}
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-xl p-8 lg:col-span-1 border border-indigo-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg mr-4">
                <i className="fas fa-cogs text-white text-lg"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800">System Details</h3>
            </div>
            <div className="space-y-5">
              <div className="p-4 bg-white rounded-xl shadow-sm border-l-4 border-l-blue-400">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <i className="fas fa-layer-group text-blue-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Roof Type</h4>
                    <p className="text-blue-600 font-medium">{data.stats.roofType}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border-l-4 border-l-green-400">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <i className="fas fa-water text-green-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Water Stored</h4>
                    <p className="text-green-600 font-medium">{Math.round(data.stats.waterStored).toLocaleString()} liters</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border-l-4 border-l-purple-400">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <i className="fas fa-digging text-purple-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Recharge Pits</h4>
                    <p className="text-purple-600 font-medium">{data.stats.rechargePits} pits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 lg:col-span-1 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg mr-4">
                <i className="fas fa-tools text-white text-lg"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
            </div>
            <div className="space-y-4">
              <button 
                onClick={handleDownloadReport}
                disabled={downloadLoading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold flex items-center justify-center space-x-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {downloadLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating Report...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-download text-lg"></i>
                    <span>Download Full Report</span>
                  </>
                )}
              </button>
              <Link
                to="/form"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold flex items-center justify-center space-x-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl transform hover:scale-105"
              >
                <i className="fas fa-edit text-lg"></i>
                <span>Modify Inputs</span>
              </Link>
              {/* <button className="w-full py-3 rounded-xl bg-green-100 text-green-700 font-medium flex items-center justify-center space-x-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <i className="fas fa-user-tie"></i>
                <span>Contact Expert</span>
              </button> */}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm p-6">
        <p>© 2023 Rainwater Harvesting Analysis Tool. All rights reserved.</p>
        <p className="mt-1">This report is generated based on your inputs and estimated calculations.</p>
      </footer>
    </div>
  );
};

export default RainwaterDashboard;