import { Avatar, Box, Divider, Typography, useMediaQuery } from "@mui/material";
import { CssBaseline } from "@mui/material"
import SideNav from "../Components/Common/Navbar";
import PieChart from "../Components/Analysis/PieChart";
import BubbleChart from "../Components/Analysis/BarChart";
import { platforms } from "../Components/Common/platefroms";
import { useEffect, useState } from "react";
import WordCloudComponent from "../Components/Analysis/wordcloud";
import LoadingScreen from "../Components/Common/Loading";
import axios from "axios";

const Analysis = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    const defaultImagePath = process.env.REACT_APP_DEFAULT_APP_IMAGE;

    const [selectedPlatform, setSelectedPlatform] = useState<string | null>('linkedin');
    const [loading,setLoading] = useState(true);

    const handlePlatformChange = (value: string) => {
        if (selectedPlatform === value) {
            // If the platform is already selected, deselect it
            setSelectedPlatform(null);
        } else {
            // If a platform is selected, update the selected platform
            setSelectedPlatform(value);
        }
    };

    const [jsonData, setJsonData] = useState(null);

    const idString = sessionStorage.getItem('Myid'); // Retrieve the value from localStorage
      if (idString !== null) {
        var id = parseInt(idString);
    }

    useEffect(() => {
        // Simulate loading for 10 seconds
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1000);

        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_Fast_API}/fetch_linkedin_data/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                });
                if (response.status === 200) {
                const data = await response.data;
                console.log("Analysis Data : ",+data);
                setJsonData(data);
              } else {
                throw new Error('Failed to fetch data');
              }
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };

        fetchData();
    
        // Clear the timer on unmount or if loading is completed early
        return () => clearTimeout(timer);
      }, []);

    return (
        <div style={{ display: 'flex', backgroundImage: `url(${defaultImagePath})`, backgroundSize:'contain', backgroundRepeat:'no-repeat', backgroundPosition:'bottom right', height:'100vh' }}>
            <CssBaseline />
            {loading && <LoadingScreen/>}
            {/* Sidebar */}
            <SideNav/>
            {/* Main content */}
            <div style={{ flex: 1 }}>
                <main style={{ flexGrow: 1, padding: 3, marginTop: '70px', marginLeft: isMobile ? '20px' : '240px', display: 'flex', flexDirection: 'column' }}>
                    {/* First row */}
                    <Box display="flex" alignItems="center" mt={2}>
                        {platforms.map(platform => (
                            <>
                            <Avatar key={platform.value} style={{ cursor: 'pointer', backgroundColor: selectedPlatform === platform.value ? '#007bff' : '#FFFFFF' , marginRight:'5px' }} onClick={() => handlePlatformChange(platform.value)}>
                                <img src={platform.imageUrl} alt={platform.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                            </Avatar>
                            <Typography variant="subtitle1" style={{marginRight:'30px', fontSize:'18px'}}>{platform.name}</Typography>
                            </>
                        ))}
                    </Box>
                    <Divider style={{ margin: '10px 0' }} />
                    {/* Render charts based on the selected platform */}
                    {selectedPlatform === 'linkedin' ? (
                        <>
                        {/* <div style={{ height: '600px' ,width:'90%', borderRadius:'20px' ,padding: '20px', backgroundColor: 'rgba(250,250,250,0.8)', border: '1px solid #ddd' }} >
                                <h2>LinkedIn Connection Details</h2>
                                <div>
                                    <MapComponent />
                                </div>
                            </div> */}
                            <div style={{ height: '600px' ,width:'90%', borderRadius:'20px' ,padding: '20px', backgroundColor: 'rgba(250,250,250,0.8)', border: '1px solid #ddd' }} >
                                <h2>LinkedIn Connection Details</h2>
                                <div>
                                    <PieChart locationData={jsonData || null} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: '50%',marginTop:'15px', borderRadius:'20px' ,height: '500px', padding: '20px', marginRight:'15px', backgroundColor: 'rgba(250,250,250,0.8)', border: '1px solid #ddd' }} >
                                <div>
                                    <WordCloudComponent locationData={jsonData || null} />
                                </div>
                            </div>
                            <div style={{ width: '50%',marginTop:'15px', borderRadius:'20px' ,height: '500px', padding: '20px', marginRight:'15px', backgroundColor: 'rgba(250,250,250,0.8)', border: '1px solid #ddd' }} >
                                <div>
                                    <BubbleChart locationData={jsonData || null} />
                                </div>
                            </div>
                        </div>
                        </>
                    ) : selectedPlatform ? (
                        <div style={{ textAlign: 'center', marginTop: '50px' }}>
                            <h2>Coming Soon for {selectedPlatform}</h2>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: '50px' }}>
                            <h2>Please select a Platform to view Analysis</h2>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default Analysis;
