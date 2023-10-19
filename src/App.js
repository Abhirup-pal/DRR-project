import React, { useEffect, useState } from 'react'
import axiox from 'axios'


function App() {
    const [data, setData] = useState([])
    useEffect(() => {
        axiox.get('http://localhost:3000/data')
            .then(res => setData(res.data))
            .catch(error => console.log(error))
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault()
        if (numDays === 0) alert("Cant supply for 0 days. Re-enter")
        const id = data.length + 1
        const drr = leadCount / numDays
        const drrDisplay = drr.toFixed(2)
        const d = new Date()
        const date = d.toLocaleDateString()
        const time = d.toLocaleTimeString()
        axiox.post('http://localhost:3000/reports', { id: id, startDate: startDate, endDate: endDate, excludedDates: excludedDates, numDays: numDays, leadCount: leadCount, drr: drr, date: date, time: time })
            .then(res => {
                setStartDate(new Date())
            })
            .catch(error => console.log(error))

        const newReport = {
            id: id,
            startDate: startDate,
            endDate: endDate,
            excludedDates: excludedDates,
            numDays: numDays,
            leadCount: leadCount,
            drl: drrDisplay,
            date: date,
            time: time,
        };
        setData([newReport, ...data]);
    }

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [excludedDates, setExcludedDates] = useState([]);
    const [numDays, setNumDays] = useState(0)
    const [leadCount, setLeadCount] = useState(0)



    //calculate difference whenever any of the dates are updated
    useEffect(() => {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        if (!isNaN(startDateObj) && !isNaN(endDateObj)) {
            const differenceInMilliseconds = endDateObj - startDateObj;
            const daysDifference = differenceInMilliseconds / (1000 * 60 * 60 * 24);
            if (excludedDates.length) setNumDays(Math.abs(Math.round(daysDifference)) - excludedDates.length + 1)
            else setNumDays(Math.abs(Math.round(daysDifference)) + 1)
        } else {
            setNumDays(0);
        }
    }, [startDate, endDate, excludedDates])

    const display = excludedDates.sort().join(', ');
    const clearForm = ()=>{
        setStartDate();
        setEndDate();
        setExcludedDates();
        setNumDays(0);
        setLeadCount(0);
    }

    return (

        <div className='container'>
            <table className="table table-hover table-striped table-sm table-responsive">
                <thead>
                    <tr>
                        <th scope='col'>Action</th>
                        <th scope='col'>ID</th>
                        <th scope='col'>Start Date</th>
                        <th scope='col'>End Date</th>
                        <th scope='col'>Excluded Dates</th>
                        <th scope='col'>Number of Days</th>
                        <th scope='col'>Lead Count</th>
                        <th scope='col'>Expected DRR</th>
                        <th scope='col'>Last Updated</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((report, index) => (

                            <tr key={index}>
                                <td>

                                </td>
                                <td>{report.id}</td>
                                <td>{report.startDate}</td>
                                <td>{report.endDate}</td>
                                <td>{report.excludedDates && report.excludedDates.sort().join(', ')}</td>
                                <td>{report.numDays}</td>
                                <td>{report.leadCount}</td>
                                <td>{report.drl}</td>
                                <td>{report.date} {report.time}</td>

                            </tr>
                        ))
                    }
                </tbody>
            </table>


            <form action='POST' className='form-control' onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center m-4">

                    <div className="d-flex-justify-content-between mx-5">
                        <label htmlFor='date' className='mx-2 fw-bold text-success'>Enter start date: </label>
                        <input type="date" name="" id="startDate" required max={endDate} onChange={(e) => setStartDate(e.target.value)} />

                    </div>
                    <div className="d-flex-justify-content-between mx-5 text-success">
                        <label htmlFor='date' className='mx-2 fw-bold'>Enter end date: </label>
                        <input type="date" name="" id="endDate" required min={startDate} onChange={(e) => {
                            setEndDate(e.target.value)
                        }} />
                    </div>


                </div>
                <div className="container text-center">
                    <label htmlFor='date' className='mx-2 fw-bold text-danger'>Exclude dates: </label>
                    <input type="date" name="" id="excludedDate" min={startDate} max={endDate} onChange={(e) => {

                        if (!excludedDates.includes(e.target.value)) {
                            setExcludedDates([...excludedDates, e.target.value]);
                        }

                    }}/>
                    <p className='mt-2'><span className="fw-bold">Dates excluded : </span>{display}</p>
                    <div className='text-center'>
                        <p><span className="fw-bold fw-bold">Number of Days: </span>{numDays}</p>
                    </div>
                    <input type="number" name="" id="leadCount" placeholder='Enter Lead Count' required onChange={e => setLeadCount(Number(e.target.value))} />

                </div>
                <div className="container text-center my-3">
                <button className='btn btn-outline-success mx-2' id='Add' type='submit'>Add</button>
                <button className='btn btn-outline-danger mx-2' id='cancel' onClick={clearForm}>Reset</button>
                </div>
            </form>
        </div>
    )
}

export default App