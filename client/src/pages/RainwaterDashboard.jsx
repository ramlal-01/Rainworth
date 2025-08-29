import React, { useEffect, useRef, useState } from 'react';

const RainwaterDashboard = () => {
  const [data, setData] = useState(null);
  const statCardsRef = useRef([]);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setData({
        location: 'Bharthia, Uttar Pradesh',
        reportDate: 'June 12, 2023',
        reportId: 'RH-2023-06-789',
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
        demandData: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]
      });
    }, 1000);
  }, []);

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

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500 mx-auto"></div>
          <h2 className="text-2xl font-semibold mt-4 text-gray-600">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

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
          <a href="#" className="text-gray-600 hover:text-blue-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">Dashboard</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">Reports</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">Settings</a>
          <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium flex items-center space-x-2">
            <i className="fas fa-user-circle"></i>
            <span>Account</span>
          </button>
        </nav>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Location & Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{data.location}</h2>
              <p className="text-gray-500">Residential Property • Concrete Roof • 4 Dwellers</p>
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
          
          {/* Sustainability Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Water Sustainability</span>
              <span className="text-blue-600 font-bold">{data.sustainability} months/year</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-300" style={{ width: '80%' }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Your rainwater harvesting system can cover 80% of your annual water needs</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {/* Stat Card 1 */}
          <div ref={el => statCardsRef.current[0] = el} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-l-blue-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-gray-500">Total Harvested Water</h3>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <i className="fas fa-tint text-blue-500"></i>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{data.stats.totalHarvested.toLocaleString()} L</p>
            <p className="text-sm text-gray-500 mt-1">per year</p>
          </div>
          
          {/* Stat Card 2 */}
          <div ref={el => statCardsRef.current[1] = el} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-l-teal-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-gray-500">Per Person Potential</h3>
              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                <i className="fas fa-users text-teal-500"></i>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{data.stats.perPersonPotential.toLocaleString()} L</p>
            <p className="text-sm text-gray-500 mt-1">per year</p>
          </div>
          
          {/* Stat Card 3 */}
          <div ref={el => statCardsRef.current[2] = el} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-l-amber-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-gray-500">Sustainability</h3>
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <i className="fas fa-calendar-alt text-amber-500"></i>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{data.stats.sustainability} months</p>
            <p className="text-sm text-gray-500 mt-1">per year</p>
          </div>
          
          {/* Stat Card 4 */}
          <div ref={el => statCardsRef.current[3] = el} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-l-red-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-gray-500">Annual Requirement</h3>
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <i className="fas fa-bullseye text-red-500"></i>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{data.stats.annualRequirement.toLocaleString()} L</p>
            <p className="text-sm text-gray-500 mt-1">per year</p>
          </div>
          
          {/* Stat Card 5 */}
          <div ref={el => statCardsRef.current[4] = el} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-l-purple-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-gray-500">Tank Size</h3>
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <i className="fas fa-archive text-purple-500"></i>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{data.stats.tankSize.toLocaleString()} L</p>
            <p className="text-sm text-gray-500 mt-1">recommended</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Rainfall vs Harvested Water Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Rainfall vs. Harvested Water</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Monthly</span>
                <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <i className="fas fa-ellipsis-h text-gray-500"></i>
                </button>
              </div>
            </div>
            <div className="h-80">
              <canvas id="rainfallChart"></canvas>
            </div>
          </div>
          
          {/* Demand vs Supply Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Demand vs. Supply</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">Monthly</span>
                <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <i className="fas fa-ellipsis-h text-gray-500"></i>
                </button>
              </div>
            </div>
            <div className="h-80">
              <canvas id="demandSupplyChart"></canvas>
            </div>
          </div>
        </div>

        {/* Additional Info & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Cost Breakdown */}
          <div className="bg-white rounded-2xl shadow-md p-6 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Cost Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tank & Installation</span>
                <span className="font-medium text-gray-800">₹45,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Filtration System</span>
                <span className="font-medium text-gray-800">₹15,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Piping & Labor</span>
                <span className="font-medium text-gray-800">₹15,000</span>
              </div>
              <div className="h-px bg-gray-200 my-4"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-semibold">Total Estimated Cost</span>
                <span className="font-bold text-blue-600">₹75,000</span>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Payback Period</span>
                <span className="font-medium text-gray-800">~3.5 years</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-300" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
          
          {/* System Details */}
          <div className="bg-white rounded-2xl shadow-md p-6 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">System Details</h3>
            <div className="space-y-5">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <i className="fas fa-layer-group text-blue-500"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Roof Type</h4>
                    <p className="text-sm text-gray-500">Concrete</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <i className="fas fa-water text-green-500"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Water Stored</h4>
                    <p className="text-sm text-gray-500">4,800 liters</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <i className="fas fa-digging text-purple-500"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Recharge Pits</h4>
                    <p className="text-sm text-gray-500">2 pits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="bg-white rounded-2xl shadow-md p-6 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Actions</h3>
            <div className="space-y-4">
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium flex items-center justify-center space-x-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <i className="fas fa-download"></i>
                <span>Download Full Report</span>
              </button>
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium flex items-center justify-center space-x-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <i className="fas fa-share-alt"></i>
                <span>Share Results</span>
              </button>
              <button className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-medium flex items-center justify-center space-x-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <i className="fas fa-edit"></i>
                <span>Modify Inputs</span>
              </button>
              <button className="w-full py-3 rounded-xl bg-green-100 text-green-700 font-medium flex items-center justify-center space-x-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <i className="fas fa-user-tie"></i>
                <span>Contact Expert</span>
              </button>
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