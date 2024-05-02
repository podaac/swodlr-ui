import { Col, Pagination, Row, Spinner } from "react-bootstrap";
import { Product } from "../../types/graphqlTypes";
import { getUserProducts } from "../../user/userData";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addPageToHistoryPageState, setUserProducts } from "../sidebar/actions/productSlice";
import { productsPerPage } from "../../constants/rasterParameterConstants";
import { useEffect, useState } from "react";


const DataPagination = () => {
    const dispatch = useAppDispatch()
    const historyPageState = useAppSelector((state) => state.product.historyPageState)
    const firstHistoryPageData = useAppSelector((state) => state.product.firstHistoryPageData)
    const userProducts = useAppSelector((state) => state.product.userProducts)
    const [noNextPage, setNoNextPage] = useState<boolean>(false)
    const [noPreviousPage, setNoPreviousPage] = useState<boolean>(true)
    const [waitingForPagination, setWaitingForPagination] = useState<boolean>(true)
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(1) 
    const [totalNumberOfProducts, setTotalNumberOfProducts] = useState<number>(0)

      useEffect(() => {
        // get the data for the first page
        // go through all the user product data to get the id of each one so that 
        const fetchData = async () => {
            await getUserProducts({limit: '1000000'}).then(response => {
                const currentPageProducts = response.products as Product[]
                const totalNumberOfProducts = currentPageProducts.length
                setTotalNumberOfProducts(totalNumberOfProducts)
                if(response.status === 'success' && currentPageProducts.length !== 0) {
                    const productsPerPageToInt = parseInt(productsPerPage)
                    const numberOfPages = Math.ceil(currentPageProducts.length/productsPerPageToInt)
                    for (let pageIndex = 0; pageIndex < numberOfPages; pageIndex++) {
                        // get index of the last product of each [productsPerPage]
                        const indexToUse = totalNumberOfProducts - (pageIndex * productsPerPageToInt) < productsPerPageToInt ? totalNumberOfProducts - (pageIndex * productsPerPageToInt) : productsPerPageToInt * (pageIndex + 1)-1
                        const idToUse = currentPageProducts[indexToUse].id
                        dispatch(addPageToHistoryPageState(idToUse))
                    }
                }
            }).then(() => setWaitingForPagination(false))
        }
        fetchData()
        .catch(console.error);
      }, []);
    
    const handlePrevious = async () => {
        if(noNextPage) setNoNextPage(false)
        if (currentPageNumber <= 2) {
            dispatch(setUserProducts(firstHistoryPageData))
            setCurrentPageNumber(currentPageNumber - 1)
            setNoPreviousPage(true)
        } else {
            await getUserProducts({limit: productsPerPage, after: historyPageState[currentPageNumber-3]}).then(response => {
                const currentPageProducts = response.products as Product[]
                dispatch(setUserProducts(currentPageProducts))
                setCurrentPageNumber(currentPageNumber - 1)
            })
        }
    }
    
    const handleNext = async () => {
        await getUserProducts({limit: productsPerPage, after: historyPageState[currentPageNumber-1]}).then(response => {
            if(response.status === 'success') {
                if(noPreviousPage) setNoPreviousPage(false)
                const currentPageProducts = response.products as Product[]
                dispatch(setUserProducts(currentPageProducts))
                setCurrentPageNumber(currentPageNumber + 1)
            } else if (response.status === 'error') {
                setNoNextPage(true)
            }
        })
    }

    const handleSelectPage = async (pageNumber: number) => {
        if (pageNumber === 1) {
            if(noPreviousPage) setNoPreviousPage(false)
            dispatch(setUserProducts(firstHistoryPageData))
            setCurrentPageNumber(pageNumber)
            setNoPreviousPage(true)
        } else {
            await getUserProducts({limit: productsPerPage, after: historyPageState[pageNumber-2]}).then(response => {
                if(response.status === 'success') {
                    if(noPreviousPage) setNoPreviousPage(false)
                    const currentPageProducts = response.products as Product[]
                    dispatch(setUserProducts(currentPageProducts))
                    setCurrentPageNumber(pageNumber)
                } else if (response.status === 'error') {
                    setNoNextPage(true)
                }
            })
        }
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
        if(currentPageNumber >= historyPageState.length-4) {
            numberOfSlotsFreeLeft = 4 - (historyPageState.length - currentPageNumber)
        }

        let numberOfSlotsFreeRight = 0
        if(currentPageNumber <= 4) {
            numberOfSlotsFreeRight = 5 - currentPageNumber
        }
        const pagesAllowed = [currentPageNumber-2, currentPageNumber-1, currentPageNumber, currentPageNumber+1, currentPageNumber+2]
        const pagesAllowedToLeftOfCurrent: number[] = []
        historyPageState.forEach((pageId, index) => {
            if(numberOfSlotsFreeLeft !== 0 && index+1 <= historyPageState.length - 3) {
                // let another number go on right
                pagesAllowedToLeftOfCurrent.push(currentPageNumber - index - 3)
                numberOfSlotsFreeLeft -= 1
            }
            if(numberOfSlotsFreeRight !== 0 && index+1 > currentPageNumber + 3) {
                // let another number go on left
                pagesAllowed.push(index)
                numberOfSlotsFreeRight -= 1
            }
        })
        pagesAllowed.unshift(...pagesAllowedToLeftOfCurrent.reverse())
        const pagesToShow = historyPageState.map((pageId, index) => {
            const pageNumberOfIndex = index + 1
            if (pageNumberOfIndex === 1 || pageNumberOfIndex === historyPageState.length) return null
            if(pagesAllowed.includes(pageNumberOfIndex)) {
                return <Pagination.Item key={`${pageNumberOfIndex}-pagination-item`} active={currentPageNumber === pageNumberOfIndex} onClick={() => handleSelectPage(pageNumberOfIndex)}>{pageNumberOfIndex}</Pagination.Item>
            }
            return null
        })
        if(pagesAllowed[0] > 2) pagesToShow.unshift(<Pagination.Ellipsis />)
        if(pagesAllowed[pagesAllowed.length-1] < historyPageState.length-1) pagesToShow.push(<Pagination.Ellipsis />)
        return pagesToShow
    }
    
    return waitingForPagination ? waitingForPaginationSpinner() : (
        <Row>
            <Col xs={2} style={{padding: '15px'}}><h5><b>{totalNumberOfProducts}</b> Total Products</h5></Col>
            <Col xs={8}>
                <Pagination data-bs-theme='dark' style={{padding: '15px'}} className="center">
                    <Pagination.Prev onClick={() => handlePrevious()} disabled={noPreviousPage} />
                    <Pagination.Item active={currentPageNumber === 1} onClick={() => handleSelectPage(1)}>1</Pagination.Item>
                    {getPaginationItemsWithEllipsis()}
                    <Pagination.Item active={currentPageNumber === historyPageState.length} onClick={() => handleSelectPage(historyPageState.length)}>{historyPageState.length}</Pagination.Item>
                    <Pagination.Next onClick={() => handleNext()} disabled={userProducts.length < parseInt(productsPerPage) || noNextPage} />
                </Pagination>
            </Col>
            <Col xs={2}></Col>
        </Row>
    )
}

export default DataPagination;
