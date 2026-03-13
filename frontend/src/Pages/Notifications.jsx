import React, { useState, useEffect } from "react";
import NavBar from "../Components/common/NavBar";
import Footer from "../Components/common/Footer";
import { getNotifications } from "../services/authService";

const Notifications = () => {



const [notifications, setNotifications] = useState([]);

useEffect(()=>{
  loadNotifications();
},[]);

const loadNotifications = async () => {
  try{
    const data = await getNotifications();
    setNotifications(data);
  }catch(err){
    console.error(err);
  }
};

return(

<div className="min-h-screen flex flex-col bg-gray-50">

{/* Navbar */}
<NavBar />

{/* Page Content */}
<div className="flex-grow max-w-3xl mx-auto p-6">

<h2 className="text-2xl font-bold mb-6 text-gray-800">
Notifications
</h2>

<div className="space-y-3">

{notifications.map(n=>(
<div
key={n.id}
className="p-4 bg-white rounded-lg shadow border hover:shadow-md transition"
>
{n.text}
</div>
))}

</div>

</div>

{/* Footer */}
<Footer />

</div>

);

};

export default Notifications;