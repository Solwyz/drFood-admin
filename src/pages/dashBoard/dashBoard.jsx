import React, { useEffect, useState } from "react";


import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import totalUserIco from "@assets/layouts/totalUser.svg";
import Api from "../../services/Api";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white shadow-md rounded-md px-3 py-2 border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: entry.fill }}
                        ></span>
                        <span className="text-sm text-gray-600">
                            {(entry.value / 100000).toFixed(1)}L
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const Dashboard = () => {
    const [orderData, setOrderData] = useState([]);
    const [overviewData, setOverviewData] = useState(null);
    const [userall, setUserall] = useState(null)
    const [newUserall, setNewUserall] = useState(null)

    const token = localStorage.getItem("token");

    const [products, setProducts] = useState([]);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await Api.get("product/bestSeller",
                    {
                        'Authorization': `Bearer ${token}`
                    });

                if (res.data.data && Array.isArray(res.data.data)) {
                    setProducts(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching top selling products:", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {

        const fetchOrderData = async () => {
            try {
                const res = await Api.get("order/graphical"
                    , {

                        'Authorization': `Bearer ${token}`

                    });




                if (res.data.success === "true") {
                    const apiData = res.data.data;

                    // Map API months to short labels
                    const monthMap = {
                        JANUARY: "Jan",
                        FEBRUARY: "Feb",
                        MARCH: "Mar",
                        APRIL: "Apr",
                        MAY: "May",
                        JUNE: "Jun",
                        JULY: "Jul",
                        AUGUST: "Aug",
                        SEPTEMBER: "Sep",
                        OCTOBER: "Oct",
                        NOVEMBER: "Nov",
                        DECEMBER: "Dec",
                    };

                    const formattedData = Object.keys(apiData).map((monthKey) => ({
                        month: monthMap[monthKey],
                        completed: apiData[monthKey].completed,
                        returned: apiData[monthKey].returned,
                    }));

                    setOrderData(formattedData);
                }
            } catch (err) {
                console.error("Error fetching order graph data:", err);
            }
        };

        fetchOrderData();
    }, []);

    const orders = {
        daily: 0,
        weekly: 0,
        monthly: 0,
    };

    const activeCoupons = 0;


    useEffect(() => {
        Api.get('order/sort/byDate'
            , {

                Authorization: `Bearer ${token}`

            })
            .then(response => {

                if (response && response.status === 200) {

                    setOverviewData(response.data);
                } else {
                    console.error('Failed resppp', response);
                }
            })
    }, [])

    useEffect(() => {
        Api.get('user/allUser',
            {
                Authorization: `Bearer ${token}`
            }
        )
            .then(res => {
                console.log("fghj", res.data.data.length)
                if (res && res.status === 200) {
                    setUserall(res.data.data);
                } else {
                    console.error('Failed res', res)
                }
            })

        Api.get('user/newUser', {
            Authorization: `Bearer ${token}`
        })
         .then(res => {
                console.log("tedrfghjk", res.data.data)
                if (res && res.status === 200) {
                    setNewUserall(res.data.data);
                } else {
                    console.error('Failed res', res)
                }
            })

    }, [])

    return (
        <div className="capitalize">
            <h1 className="text-xl leading-6 text-[#BF6A02] font-medium ">
                Dashboard
            </h1>

            {/* Grid Cards */}
            <div className=" bg-white  mt-4 p-4  ">
                <h1 className="text-base font-semibold leading-6">Overview</h1>
                <div className="grid grid-cols-4 mt-2 gap-4">
                    <div className="bg-[#EBF5FF] py-4 px-6 h-[110px]  border-l-[3px] border-[#5B6D7E]">
                        <p className="text-base font-medium leading-[22px] ">Daily Orders</p>
                        <p className="text-[32px] font-semibold leading-10 mt-4">
                            {overviewData?.dailyOrders}
                        </p>
                    </div>
                    <div className="bg-[#F4EDFF] py-4 px-6  h-[110px] border-l-[3px] border-[#AA99C4]">
                        <p className="text-base font-medium leading-[22px] ">
                            Monthly Orders
                        </p>
                        <p className="text-[32px] font-semibold leading-10 mt-4">
                            {overviewData?.monthlyOrders}
                        </p>
                    </div>
                    <div className="bg-[#E8FFF9] py-4 px-6  h-[110px] border-l-[3px] border-[#83AEA3]">
                        <p className="text-base font-medium leading-[22px] ">
                            Todays Revenue
                        </p>
                        <p className="text-[32px] font-semibold leading-10 mt-4">
                            {overviewData?.totalRevenue}
                        </p>
                    </div>
                    <div className="bg-[#FFF7EC] py-4 px-6  h-[110px] border-l-[3px] border-[#C0AC90]">
                        <p className="text-base font-medium leading-[22px] ">
                            Active Rewards
                        </p>
                        <p className="text-[32px] font-semibold leading-10 mt-4">
                            {overviewData?.activeCoupons}
                        </p>
                    </div>
                </div>
            </div>

            {/* Chart + Revenue */}
            <div className="flex gap-4 mt-4">
                <div className="bg-white w-[550px] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-medium leading-[22px] ">
                            Order Statistics
                        </h2>

                    </div>

                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={orderData} barCategoryGap="10%">
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: "#615E83",
                                    fontSize: 12,
                                    fontWeight: 400,
                                    lineHeight: 16,
                                }}
                            />
                            <YAxis
                                type="number"
                                domain={[0, 50]}
                                ticks={[0, 10, 20, 30, 40, 50, 100, 200, 500, 1000]} // custom tick values
                                interval={0} // <- force show every tick
                                allowDecimals={false}
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: "#615E83",
                                    fontSize: 12,
                                    fontWeight: 400,
                                    lineHeight: 16,
                                }}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-white shadow-md rounded-md px-3 py-2 border border-gray-200">
                                                <p className="text-sm font-medium text-gray-700 mb-1">
                                                    {label}
                                                </p>
                                                {payload.map((entry, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <span
                                                            className="w-2.5 h-2.5 rounded-full"
                                                            style={{ backgroundColor: entry.fill }}
                                                        ></span>
                                                        <span className="text-sm text-gray-600">
                                                            {entry.value} Orders
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                                cursor={{ fill: "transparent" }}
                            />
                            <Bar
                                dataKey="completed"
                                fill="#6390BA"
                                barSize={10}
                                radius={[8, 8, 0, 0]}
                                name="Completed"
                            />
                            <Bar
                                dataKey="returned"
                                fill="#D4EBFE"
                                barSize={10}
                                radius={[8, 8, 0, 0]}
                                name="Return"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="flex items-center justify-end gap-4">
                        <div className="flex items-center">
                            <span className="rounded-full bg-[#6390BA] w-3 h-3 mr-2"></span>
                            <span className="font-medium text-base leading-[22px]">
                                Completed
                            </span>
                        </div>
                        <div className="flex items-center">
                            <span className="rounded-full bg-[#D4EBFE] w-3 h-3 mr-2"></span>
                            <span className="font-medium text-base leading-[22px]">
                                Return
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white text-center rounded-lg w-[176px] h-[140px] p-4">
                        <h2 className="text-base text-center flex font-medium mb-4 text-gray-700">
                            <img src={totalUserIco} className="mr-2" alt="" /> Total Users
                        </h2>
                        <div className="text-3xl font-semibold text-[#4A739C]">{userall?.length}</div>
                    </div>
                    <div className="bg-white  text-center rounded-lg w-[176px] h-[140px] p-4">
                        <h2 className="text-base text-center flex font-medium mb-4 text-gray-700">
                            <img src={totalUserIco} className="mr-2" alt="" /> New Users
                        </h2>
                        <div className="text-3xl font-semibold text-[#4A739C]">{newUserall?.usersToday}</div>
                    </div>
                </div>

                <div className="bg-white w-[356px] rounded-lg p-4 shadow-sm">
                    <h2 className="text-base font-medium leading-[22px] mb-3">
                        Top selling products
                    </h2>

                    {products.length > 0 ? (
                        // ✅ Scroll container added here
                        <div className="max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-1">
                            <ul className="space-y-3">
                                {products.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center text-sm font-medium text-[#0F0F0F]"
                                    >
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={item.imageUrls || ""}
                                                alt={item.name}
                                                className="w-6 h-6 rounded-md object-cover"
                                            />
                                            <span>{item.name}</span>
                                        </div>
                                        <span className="text-[#00A94F]">{item.totalSold || 0}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm mt-4">No products available</p>
                    )}
                </div>

                <div></div>
            </div>

            {/* Enquiry Status */}
            <div className="bg-white mt-4  h-[300px]  shadow p-4"></div>
        </div>
    );
};

export default Dashboard;
