import React ,{useState, useMemo}from 'react'

const CinemaSeatBooking = ({
    layout ={
        rows:8, seatsPerRow:12, aislePosition:5
    },
    seatTypes = {
        regular : { name: 'Regular', price: 150, rows : [0,1,2] },
        premium : { name: 'Premium', price: 250, rows : [3,4,5] },
        vip : { name: 'VIP', price: 350, rows : [6,7] },
    },
    bookedSeats = [],
    currency = '₹',
    onBookingComplete = () => {},
    title = 'Cinema Seat Booking',
    subtitle = 'Select your seats and proceed to payment',
}) => {

    const colours = [
        "blue", "green", "yellow", "red", "purple", "orange","purple", "cyan", "teal", "indigo"
    ]; 

    const getSeatType = (row) => {
        const seatTypeEntry = Object.entries(seatTypes);
        for(let i=0; i<seatTypeEntry.length; i++){
            const [type, info] = seatTypeEntry[i];
            if(info.rows.includes(row)){
                const color = colours[i % colours.length];
                return { type, color, ...info};
            }
        }

        const [firstType, firstInfo] = seatTypeEntry[0];
        return { type: firstType, color: colours[0], ...firstInfo};
    }

    const initializeSeats = useMemo(() => {
        const seats = [];
        for(let row = 0; row < layout.rows; row++) {
            const seatRow = [];
            const seatTypeInfo = getSeatType(row);
            for(let seat = 0; seat < layout.seatsPerRow; seat++) {
                const seatId = `${String.fromCharCode(65 + row)}${seat + 1}`;
                seatRow.push({
                    id: seatId,
                    row,
                    seat,
                    type: seatTypeInfo?.type || 'regular',
                    price: seatTypeInfo?.price || 150,
                    color: seatTypeInfo?.color || 'blue',
                    status: bookedSeats.includes(seatId) ? 'booked' : 'available',
                    selected: false, 
                });
            }
            seats.push(seatRow);
        }
        return seats;
    }, [layout, seatTypes, bookedSeats]);

    const [seats, setSeats] = useState(initializeSeats);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const getColorClass = (colorName) => {
        const colorClasses = {
            blue: 'bg-blue-200 border-blue-300 text-blue-800 hover:bg-blue-300 hover:border-blue-400',
            green: 'bg-green-200 border-green-300 text-green-800 hover:bg-green-300 hover:border-green-400',  
            yellow: 'bg-yellow-200 border-yellow-300 text-yellow-800 hover:bg-yellow-300 hover:border-yellow-400',
            red: 'bg-red-200 border-red-300 text-red-800 hover:bg-red-300 hover:border-red-400',
            purple: 'bg-purple-200 border-purple-300 text-purple-800 hover:bg-purple-300 hover:border-purple-400',
            orange: 'bg-orange-200 border-orange-300 text-orange-800 hover:bg-orange-300 hover:border-orange-400',
            cyan: 'bg-cyan-200 border-cyan-300 text-cyan-800 hover:bg-cyan-300 hover:border-cyan-400',
            teal: 'bg-teal-200 border-teal-300 text-teal-800 hover:bg-teal-300 hover:border-teal-400',
            indigo: 'bg-indigo-200 border-indigo-300 text-indigo-800 hover:bg-indigo-300 hover:border-indigo-400',
        };
        return colorClasses[colorName] || colorClasses.blue;
    }

    const getSeatClassName = (seat) => {
        const baseClass = "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 m-1 rounded-t-lg border-2 transition-all duration-200 flex items-center justify-center text-xs sm:text-sm font-bold border-blue-300 text-blue-800";
        
        if(seat.status === "booked") {
            return `${baseClass} bg-gray-400 border-gray-500 text-gray-600 cursor-not-allowed`;
        }
        if(seat.selected) {
            return `${baseClass} bg-green-500 border-green-600 text-white transform scale-110 cursor-pointer`;
        }

        return `${baseClass} ${getColorClass(seat.color)} cursor-pointer`;
    };

    const handleSeatClick = (rowIndex, seatIndex) => {
        const seat = seats[rowIndex][seatIndex];
        if(seat.status === 'booked') return;

        const isCurrentlySelected = seat.selected;

        setSeats(prevSeats => {
            return prevSeats.map((row, rIdx) => row.map((s, sIdx)=> {
                if(rIdx === rowIndex && sIdx === seatIndex) {
                    return {...s, selected: !isCurrentlySelected};
                }
                return s;
            }));
        });

        if(isCurrentlySelected) {
            setSelectedSeats(prevSelected => prevSelected.filter(s => s.id !== seat.id));
        }else{
            setSelectedSeats(prevSelected => [...prevSelected, seat]);
        }
    };

    const renderSeatSection = (seatRow, startIndex, endIndex) => {
        return <div className="flex">
            {seatRow.slice(startIndex, endIndex).map((seat, index) => {
                return <div className={getSeatClassName(seat)} key={seat.id}
                title={`${seat.id} - ${getSeatType(seat.row)?.name || 'Regular'} - ${currency}${seat.price} - ${seat.status}`}
                onClick={() => handleSeatClick(seat.row, startIndex + index)}>
                    {" "}
                    {startIndex + index + 1}
                </div>;
            })}
        </div>
    };

    const uniqueSeatTypes = Object.entries(seatTypes).map(([type,info], index) => {
        return {
            type,
            color: colours[index % colours.length],
            ...info
        };
    });

  return (
    <div className="w-full min-h-screen  bg-gray-50 p-4 ">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-center mb-2 text-gray-800">{title}</h1>
            <p className="text-center text-gray-600 mb-6">{subtitle}</p>
            <div className="mb-8">
                <div className="w-full h-4 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded mb-2 shadow-inner"></div>
                <p className="text-center text-sm text-gray-500 font-medium">SCREEN</p>
            </div>
            <div className="mb-6 overflow-x-auto">
                <div className="flex flex-col items-center min-w-max">
                    {
                        seats.map((row, rowIndex) => {
                            return(
                                <div key={rowIndex} className="flex items-center mb-2">
                                    <span className="w-8 text-center font-bold text-gray-600 mr-4">
                                        {String.fromCharCode(65 + rowIndex)}
                                    </span>
                                    {renderSeatSection(row,0, layout.aislePosition)}
                                    <div className="w-8"></div>
                                    {renderSeatSection(row,layout.aislePosition, layout.seatsPerRow)}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
                    {
                        uniqueSeatTypes.map((seatType) => {
                            return <div key={seatType.type} className="flex items-center gap-2">
                                <div className={`w-6 h-6 border-2 rounded-t-lg mr-2 ${getColorClass(seatType.color)}`}></div>
                                <span className="text-gray-700 font-medium">{`${seatType.name} (${currency}${seatType.price})`}</span> 
                            </div>;
                        })
                    }

                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-green-500 border-2 border-green-600 rounded-t-lg mr-2"></div>
                        <span className="text-sm">Selected</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-400 border-2 border-gray-500 rounded-t-lg mr-2"></div>
                        <span className="text-sm">Booked</span>
                    </div>
            </div>
        </div>
        
    </div>
  )
}

export default CinemaSeatBooking;
