import { Col, Pagination, Row, Spinner } from "react-bootstrap";
import { Product } from "../../types/graphqlTypes";
import { getUserProducts } from "../../user/userData";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addPageToHistoryPageState, setAllUserProducts, setUserProducts } from "../sidebar/actions/productSlice";
import { productsPerPage } from "../../constants/rasterParameterConstants";
import { useEffect, useState } from "react";
import { productPassesFilterCheck } from "./GeneratedProductHistory";


const DataPagination = (props: {totalNumberOfProducts: number, totalNumberOfFilteredProducts: number, }) => {
    const {totalNumberOfProducts, totalNumberOfFilteredProducts} = props
    const dispatch = useAppDispatch()
    const historyPageState = useAppSelector((state) => state.product.historyPageState)
    const firstHistoryPageData = useAppSelector((state) => state.product.firstHistoryPageData)
    const userProducts = useAppSelector((state) => state.product.userProducts)
    const currentFilters = useAppSelector((state) => state.product.currentFilters)
    const allUserProducts = useAppSelector((state) => state.product.allUserProducts)
    const [noNextPage, setNoNextPage] = useState<boolean>(false)
    const [noPreviousPage, setNoPreviousPage] = useState<boolean>(true)
    const [waitingForPagination, setWaitingForPagination] = useState<boolean>(false)
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(1) 
    // const [totalNumberOfProducts, setTotalNumberOfProducts] = useState<number>(0)
    const numberOfTotalPages = Math.ceil(allUserProducts.length / parseInt(productsPerPage))

    // useEffect(() => {
    //     // get the data for the first page
    //     // go through all the user product data to get the id of each one so that 
    //     const fetchData = async () => {
    //         await getUserProducts({limit: '1000000'}).then(response => {
    //             const currentPageProducts = response.products as Product[]
    //             const totalNumberOfProducts = currentPageProducts.length
    //             setTotalNumberOfProducts(totalNumberOfProducts)
    //             if(response.status === 'success' && currentPageProducts.length !== 0) {
    //                 const productsPerPageToInt = parseInt(productsPerPage)
    //                 const numberOfPages = Math.ceil(currentPageProducts.length/productsPerPageToInt)
    //                 for (let pageIndex = 0; pageIndex < numberOfPages; pageIndex++) {
    //                     // get index of the last product of each [productsPerPage]
    //                     const indexToUse = totalNumberOfProducts - (pageIndex * productsPerPageToInt) < productsPerPageToInt ? totalNumberOfProducts - (pageIndex * productsPerPageToInt) : productsPerPageToInt * (pageIndex + 1)-1
    //                     const idToUse = currentPageProducts[indexToUse].id
    //                     dispatch(addPageToHistoryPageState(idToUse))
    //                 }
    //             }
    //         }).then(() => setWaitingForPagination(false))
    //     }
    //     fetchData()
    //     .catch(console.error);
    //   }, []);
    
    // const handlePrevious = async () => {
    //     if(noNextPage) setNoNextPage(false)
    //     if (currentPageNumber <= 2) {
    //         dispatch(setUserProducts(firstHistoryPageData))
    //         setCurrentPageNumber(currentPageNumber - 1)
    //         setNoPreviousPage(true)
    //     } else {
    //         await getUserProducts({limit: productsPerPage, after: historyPageState[currentPageNumber-3]}).then(response => {
    //             const currentPageProducts = response.products as Product[]
    //             dispatch(setUserProducts(currentPageProducts))
    //             setCurrentPageNumber(currentPageNumber - 1)
    //         })
    //     }
    // }
    
    // const handleNext = async () => {
    //     await getUserProducts({limit: productsPerPage, after: historyPageState[currentPageNumber-1]}).then(response => {
    //         if(response.status === 'success') {
    //             if(noPreviousPage) setNoPreviousPage(false)
    //             const currentPageProducts = response.products as Product[]
    //             dispatch(setUserProducts(currentPageProducts))
    //             setCurrentPageNumber(currentPageNumber + 1)
    //         } else if (response.status === 'error') {
    //             setNoNextPage(true)
    //         }
    //     })
    // }

    const handleSelectPage = async (pageNumber: number) => {
        const firstNumber = (pageNumber-1) * parseInt(productsPerPage)
        const lastNumber = firstNumber + parseInt(productsPerPage)
        dispatch(setUserProducts(allUserProducts.slice(firstNumber, lastNumber)))
        setCurrentPageNumber(pageNumber)
        if(pageNumber === 1) {
            setNoPreviousPage(true)
            setNoNextPage(false)
        } else if (pageNumber === numberOfTotalPages) {
            setNoPreviousPage(false)
            setNoNextPage(true)
        } else {
            setNoPreviousPage(false)
            setNoNextPage(false)
        }
        // if (pageNumber === 1) {
        //     if(noPreviousPage) setNoPreviousPage(false)
        //     dispatch(setUserProducts(firstHistoryPageData))
        //     setCurrentPageNumber(pageNumber)
        //     setNoPreviousPage(true)
        // } else {
        //     await getUserProducts({limit: productsPerPage, after: historyPageState[pageNumber-2]}).then(response => {
        //         if(response.status === 'success') {
        //             if(noPreviousPage) setNoPreviousPage(false)
        //             const currentPageProducts = response.products as Product[]
        //             dispatch(setUserProducts(currentPageProducts))
        //             setCurrentPageNumber(pageNumber)
        //         } else if (response.status === 'error') {
        //             setNoNextPage(true)
        //         }
        //     })
        // }
    }

    const waitingForPaginationSpinner = () => {
        return (
            <div>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner> 
            </div>
        )
    }

    const getPaginationItemsWithEllipsis = () => {
        let numberOfSlotsFreeLeft = 0
        if(currentPageNumber >= numberOfTotalPages-4) {
            numberOfSlotsFreeLeft = 4 - (numberOfTotalPages - currentPageNumber)
        }

        let numberOfSlotsFreeRight = 0
        if(currentPageNumber <= 4) {
            numberOfSlotsFreeRight = 5 - currentPageNumber
        }
        const pagesAllowed = [currentPageNumber-2, currentPageNumber-1, currentPageNumber, currentPageNumber+1, currentPageNumber+2]
        const pagesAllowedToLeftOfCurrent: number[] = []
        for(let index=0; index<numberOfTotalPages; index++) {
            if(numberOfSlotsFreeLeft !== 0 && index+1 <= numberOfTotalPages - 3) {
                // let another number go on right
                pagesAllowedToLeftOfCurrent.push(currentPageNumber - index - 3)
                numberOfSlotsFreeLeft -= 1
            }
            if(numberOfSlotsFreeRight !== 0 && index+1 > currentPageNumber + 3) {
                // let another number go on left
                pagesAllowed.push(index)
                numberOfSlotsFreeRight -= 1
            }
        }
        // historyPageState.forEach((pageId, index) => {
        //     if(numberOfSlotsFreeLeft !== 0 && index+1 <= numberOfTotalPages - 3) {
        //         // let another number go on right
        //         pagesAllowedToLeftOfCurrent.push(currentPageNumber - index - 3)
        //         numberOfSlotsFreeLeft -= 1
        //     }
        //     if(numberOfSlotsFreeRight !== 0 && index+1 > currentPageNumber + 3) {
        //         // let another number go on left
        //         pagesAllowed.push(index)
        //         numberOfSlotsFreeRight -= 1
        //     }
        // })
        pagesAllowed.unshift(...pagesAllowedToLeftOfCurrent.reverse())
        const pagesToShow = []
        for(let pageIndex = 1; pageIndex < numberOfTotalPages-1; pageIndex++) {
            const pageNumberOfIndex = pageIndex + 1
            if(pagesAllowed.includes(pageNumberOfIndex)) {
                pagesToShow.push( <Pagination.Item key={`${pageNumberOfIndex}-pagination-item`} active={currentPageNumber === pageNumberOfIndex} onClick={() => handleSelectPage(pageNumberOfIndex)}>{pageNumberOfIndex}</Pagination.Item>)
            }
        }
        // const pagesToShow = historyPageState.map((pageId, index) => {
        //     const pageNumberOfIndex = index + 1
        //     if (pageNumberOfIndex === 1 || pageNumberOfIndex === numberOfTotalPages) return null
        //     if(pagesAllowed.includes(pageNumberOfIndex)) {
        //         return <Pagination.Item key={`${pageNumberOfIndex}-pagination-item`} active={currentPageNumber === pageNumberOfIndex} onClick={() => handleSelectPage(pageNumberOfIndex)}>{pageNumberOfIndex}</Pagination.Item>
        //     }
        //     return null
        // })
        if(pagesAllowed[0] > 2) pagesToShow.unshift(<Pagination.Ellipsis />)
        if(pagesAllowed[pagesAllowed.length-1] < numberOfTotalPages-1) pagesToShow.push(<Pagination.Ellipsis />)
        return pagesToShow
    }

    return waitingForPagination ? waitingForPaginationSpinner() : (
        <Row>
            <Col xs={2} style={{paddingTop: '15px'}}><h5><b>{totalNumberOfProducts}</b> Total Products</h5></Col>
            <Col xs={8}>
                {
                    totalNumberOfFilteredProducts !== 0 ?
                    <Pagination data-bs-theme='dark' style={{paddingTop: '15px'}} className="center">
                        <Pagination.Prev onClick={() => handleSelectPage(currentPageNumber-1)} disabled={noPreviousPage} />
                        <Pagination.Item active={currentPageNumber === 1} onClick={() => handleSelectPage(1)}>1</Pagination.Item>
                        {getPaginationItemsWithEllipsis()}
                        <Pagination.Item active={currentPageNumber === numberOfTotalPages} onClick={() => handleSelectPage(numberOfTotalPages)}>{numberOfTotalPages}</Pagination.Item>
                        <Pagination.Next onClick={() => handleSelectPage(currentPageNumber+1)} disabled={userProducts.length < parseInt(productsPerPage) || noNextPage} />
                    </Pagination>
                    : null
                }
            </Col>
            <Col xs={2}></Col>
        </Row>
    )
}

export default DataPagination;

