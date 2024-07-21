import { useParams, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react';

import GLOBAL_STATE from "../state";

const Dashboard = () => {
	const state = GLOBAL_STATE("dashboard")
	return (
		<h1> WELCOME NUUB</h1>
	)
}

export default Dashboard;
