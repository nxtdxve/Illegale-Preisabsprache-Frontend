"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import styles from "/src/app/page.module.css";
import Highcharts, { Tooltip, chart } from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

export default function Info({ params }) {
    const [products, setProducts] = useState([]);
    useEffect(() =>{
        fetch(`https://baumarkt-backend-1e27ff4f12df.herokuapp.com/products/${params.id}`, { cache: 'force-cache'})
        .then((response) => response.json())
        .then((data) => {
            setProducts(data);
        })
        .catch((err) => {
            console.log(err.message);
        });
    }, []);

  
    const [retailers, setRetailers] = useState([]);
    useEffect(() => {
        fetch('https://baumarkt-backend-1e27ff4f12df.herokuapp.com/retailers', { cache: 'force-cache'})
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setRetailers(data);
        })
        .catch((err) => {
            console.log(err.message);
        });
    }, []);

    function prepareChartData(ret, prd) {     

        const groupAndExtendDataByRetailer = (data) => {
            const groups = {};
            console.log('group data: ' + JSON.stringify(data))
            
            data?.forEach((record) => {
                const { retailer_id, price, timestamp } = record;
                if (!groups[retailer_id]) {
                    groups[retailer_id] = [];
                }
                groups[retailer_id].push([
                    new Date(timestamp).getTime(),
                    parseFloat(price),
                ]);
            });
            
            return groups;
        };
            
        const this_price_records = prd.price_details?.price_records ? prd.price_details.price_records : null
        const groupedData = groupAndExtendDataByRetailer(this_price_records);
        console.log("output grouped data" + JSON.stringify(groupedData))
        const earliestDate = Math.min(
            ...Object.values(groupedData)
            .flat()
            .map((d) => d[0])
        );
        const today = new Date().getTime();

        const retailerMap = {};
        ret.forEach((r) => {
          retailerMap[r._id.$oid] = r.name;
        });

        // Erstellen der Datenreihen für das Diagramm
        const series = Object.keys(groupedData).map((retailer_id) => ({
            name: retailerMap[retailer_id] || `Händler ${retailer_id}`,
            data: groupedData[retailer_id],
        }));

        console.log("Series data " + series)

        const options = {
            chart: {
                type: "line",
            },
            title: {
                text: "Preisentwicklung",
                align: 'center'
            },

            yAxis: {
                title: {
                    text: 'Preis'
                }
            },

            xAxis: {
                type : "datetime",
                dateTimeLabelFormats: {
                    hour: "%e %b %Y, %H:%M", // zeigt '5 Jan 2024, 15:00'
                    day: "%e %b %Y, %H:%M", // zeigt '5 Jan 2024, 15:00'
                    month: "%b '%y", // zeigt 'Jan '24'
                    year: "%Y", // zeigt '2024'
                },
                title: {
                    text: 'Datum'
                },
                min: earliestDate,
                max: today,
            },

            tooltip: {
                xDateFormat: "%e %b %Y, %H:%M:%S",
                shared: true,
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },

            series: series,
            credits: {
            enabled: false, // Deaktiviert das Highcharts.com-Credit-Logo
            },

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        }

        console.log('Chart data: ' + JSON.stringify(options))
        return options
    }

    return (
        <div>
            <Link href={"../"}>Home</Link>
            <div>
                <h1>{products.name}</h1>

                {retailers.map((retailer) => {
                    var current_price
                    var latest_timestamp = new Date("2000-01-01")
                    var link_website
                    if (products.price_details?.price_records) {
                        products.price_details.price_records.map( (retailer_price)  => {
                            if (retailer_price.retailer_id == retailer._id.$oid) {
                                if (latest_timestamp < new Date(retailer_price.timestamp)){
                                    current_price = retailer_price.price
                                    latest_timestamp = retailer_price.timestamp
                                }
                            }
                        })
                    }
                    if (products.retailer_urls){
                        products.retailer_urls.map( (web_urls) => {
                            if (web_urls.retailer_id == retailer._id.$oid){
                                link_website = web_urls.url
                            }
                        })
                    }
                    return (
                        <div>
                            <p className={styles.product_price}>{retailer.name}: CHF {current_price}</p>
                            <a href={link_website}>zur Webseite</a>
                        </div>
                    )
                })}

                <div>
                   <HighchartsReact highcharts={Highcharts} options={prepareChartData(retailers, products)}/>
                </div>
                   
            </div>
        </div>
    )
};