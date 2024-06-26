import { Alert, Col, OverlayTrigger, Row, Table, Tooltip, Spinner, Form, DropdownButton, Dropdown, Badge } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Product } from "../../types/graphqlTypes";
import { useEffect, useState } from "react";
import { InfoCircle } from "react-bootstrap-icons";
import { generatedProductsLabels, infoIconsToRender, parameterHelp, productsPerPage } from "../../constants/rasterParameterConstants";
import { getUserProducts } from "../../user/userData";
import { useLocation, useNavigate } from "react-router-dom";
import DataPagination from "./DataPagination";
import HistoryFilters, { getFilterParameters, productPassesFilterCheck } from "./HistoryFilters";
import { setShowReGenerateProductModalTrue } from "../sidebar/actions/modalSlice";
import ReGenerateProductsModal from "./ReGenerateProductsModal";
import { setAllUserProducts, setGranulesToReGenerate, setUserProducts, setWaitingForMyDataFiltering, setWaitingForMyDataFilteringReset, setWaitingForProductsToLoad } from "../sidebar/actions/productSlice";
import { defaultUserProductsLimit } from "../../constants/graphqlQueries";

const GeneratedProductHistory = () => {
    const dispatch = useAppDispatch()
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const userProducts = useAppSelector((state) => state.product.userProducts)
    const currentFilters = useAppSelector((state) => state.product.currentFilters)
    const waitingForProductsToLoad = useAppSelector((state) => state.product.waitingForProductsToLoad)
    const waitingForMyDataFiltering = useAppSelector((state) => state.product.waitingForMyDataFiltering)
    const waitingForMyDataFilteringReset = useAppSelector((state) => state.product.waitingForMyDataFilteringReset)
    const { search } = useLocation()
    const navigate = useNavigate()
    const [totalNumberOfProducts, setTotalNumberOfProducts] = useState<number>(0)
    const [totalNumberOfFilteredProducts, setTotalNumberOfFilteredProducts] = useState<number>(0)
    const [checkedProducts, setCheckedProducts] = useState<Product[]>([])
    const [allChecked, setAllChecked] = useState<boolean>(false)
    const [hasAlreadyLoadedInitialProducts, setHasAlreadyLoadedInitialProducts] = useState<boolean>(false)
    
    useEffect(() => {
        // get the data for the first page
        // go through all the user product data to get the id of each one so that 
        const fetchData = async () => {
            if(!waitingForMyDataFiltering) dispatch(setWaitingForProductsToLoad(true))

            const productQueryParameters = getFilterParameters(currentFilters, defaultUserProductsLimit)
            // add variables for filters
            await getUserProducts(productQueryParameters).then(response => {
                dispatch(setWaitingForProductsToLoad(false))
                // filter products for what is in the filter
                const allProducts = response.products as Product[]
                setTotalNumberOfProducts(allProducts.length)
                const filteredProducts = allProducts.filter(product => {
                    const {status, utmZoneAdjust, mgrsBandAdjust, rasterResolution} = product
                    const statusToUse = status[0].state
                    const productPassesFilter = productPassesFilterCheck(currentFilters, statusToUse, rasterResolution, utmZoneAdjust, mgrsBandAdjust)
                    if(productPassesFilter) {
                        return product
                    } else {
                        return null
                    }
                })
                setTotalNumberOfFilteredProducts(filteredProducts.length)
                setHasAlreadyLoadedInitialProducts(true)
                dispatch(setAllUserProducts(filteredProducts))
                const productsPerPageToInt = parseInt(productsPerPage)
                dispatch(setUserProducts(filteredProducts.slice(0, productsPerPageToInt)))
                dispatch(setWaitingForMyDataFiltering(false))
                dispatch(setWaitingForMyDataFilteringReset(false))
            })
        }
        fetchData().catch(console.error)
      }, [dispatch, currentFilters, waitingForMyDataFiltering, waitingForMyDataFilteringReset]);

      // reset all checked checkbox when going to next page
      useEffect(() => {
        setAllChecked(false)
      }, [userProducts]);

    const handleCopyClick = (downloadUrls: string[]) => {
        navigator.clipboard.writeText(downloadUrls.join('\n'))
    }

    const renderInfoIcon = (parameterId: string) => (
        <OverlayTrigger
            placement="right"
            overlay={
                <Tooltip id="button-tooltip">
                {parameterHelp[parameterId]}
              </Tooltip>
            }
        >
           <InfoCircle/>
        </OverlayTrigger>
    )

    const handleDownloadProduct = (downloadUrlStrings: string[]) => {
        downloadUrlStrings.forEach((downloadUrl, index) => {
            window.open(downloadUrl, String(index))
        })
    }

    const handleOnReGenerateClick = (granuleObjects: Product[]) => {
        dispatch(setGranulesToReGenerate(granuleObjects))
        dispatch(setShowReGenerateProductModalTrue())
    }
    
    const renderColTitle = (labelEntry: string[], index: number) => {
        let infoIcon = infoIconsToRender.includes(labelEntry[0]) ? renderInfoIcon(labelEntry[0]) : null
        let labelId = (labelEntry[0] === 'downloadUrl') ? 'download-url' : ''
        return (
            <th key={`${labelEntry[0]}-${index}`} id={labelId}>{labelEntry[1]} {infoIcon}</th>
        )
    }

    // select product or remove if already selected
    const handleProductChecked = (selectedProducts: Product[], checkType: 'single' | 'all') => {
        let checkedProductsClone = [...checkedProducts]
        
        selectedProducts.forEach(selectedProduct => {
            const productAlreadySelected: boolean = checkedProductsClone.map(product => product.id).includes(selectedProduct.id)
            const productShouldBeRemoved: boolean = checkType === 'all' ? allChecked : productAlreadySelected

            if(productShouldBeRemoved) {
                // remove product from checked list
                checkedProductsClone = checkedProductsClone.filter(product => product.id !== selectedProduct.id)
            } else {
                // add product to checked list
                if(!productAlreadySelected) checkedProductsClone.push(selectedProduct)
            }
        })
        if(checkType === 'all') setAllChecked(!allChecked)
        setCheckedProducts(checkedProductsClone)
    }

    const renderHistoryTable = () => {
        const downloadButtonDisabled = checkedProducts.length === 0 || checkedProducts.every(product => product.granules.length === 0)
        const downloadUrlList = checkedProducts.map(product => product.granules.map(granule => granule.uri)).flat()
        return (
            <Row>
                {<Col xs={2} style={{height: '100%'}}><HistoryFilters /></Col>}                
                <Col xs={10}>
                    <div style={{padding: '0px 20px 20px 20px'}} id='history-table'>
                    <div>
                    {
                    <>
                    <Row>
                        <Col xs={1}>
                        <DropdownButton data-bs-theme='dark' style={{}} id="dropdown-basic-button" title={<><Badge bg="secondary">{checkedProducts.length}</Badge> Actions</>}>
                            <Dropdown.Item disabled={downloadButtonDisabled} onClick={() => handleDownloadProduct(downloadUrlList)}>Download</Dropdown.Item>
                            <Dropdown.Item disabled={downloadButtonDisabled} onClick={() => handleCopyClick(downloadUrlList)}>Copy Download Url</Dropdown.Item>
                            <Dropdown.Item disabled={checkedProducts.length === 0} onClick={() => handleOnReGenerateClick(checkedProducts)}>Re-Generate</Dropdown.Item>
                            <ReGenerateProductsModal />
                        </DropdownButton>
                        </Col>
                    </Row>
                    <div className="table-responsive-generatedProducts table-responsive">
                    <Table bordered hover className={`${colorModeClass}-table`} style={{marginBottom: '0px'}}>
                    <thead>
                    <tr>
                        <th key='select-action' id='select-action'>
                            <Form>
                                <div className="mb-3">
                                    <Form.Check type='checkbox' checked={allChecked} id='select-all-products-checkbox' label='' onChange={() => handleProductChecked(userProducts, 'all')}/>
                                </div>
                            </Form>
                        </th>
                        {Object.entries(generatedProductsLabels).map((labelEntry, index) => renderColTitle(labelEntry, index))}
                    </tr>
                    </thead>
                    <tbody>
                        {userProducts.map((generatedProductObject, index) => {
                            const {id, status, utmZoneAdjust, mgrsBandAdjust, outputGranuleExtentFlag, outputSamplingGridType, rasterResolution, timestamp: dateGenerated, cycle, pass, scene, granules} = generatedProductObject
                            const statusToUse = status[0].state
                            const downloadUrl = granules && granules.length !== 0 ? granules[0].uri.split('/').pop() : 'N/A'
                            const utmZoneAdjustToUse = outputSamplingGridType === 'GEO' ? 'N/A' : utmZoneAdjust
                            const mgrsBandAdjustToUse = outputSamplingGridType === 'GEO' ? 'N/A' : mgrsBandAdjust
                            const outputSamplingGridTypeToUse = outputSamplingGridType === 'GEO' ? 'LAT/LON' : outputSamplingGridType
                            const outputGranuleExtentFlagToUse = outputGranuleExtentFlag ? '256 x 128 km' : '128 x 128 km'
                            const productRowValues = {cycle, pass, scene, status: statusToUse, outputGranuleExtentFlag: outputGranuleExtentFlagToUse, outputSamplingGridType: outputSamplingGridTypeToUse, rasterResolution, utmZoneAdjust: utmZoneAdjustToUse, mgrsBandAdjust: mgrsBandAdjustToUse, downloadUrl, dateGenerated}

                            return (
                                <tr className={`${colorModeClass}-table hoverable-row`} key={`generated-products-data-row-${index}`}>
                                <td>
                                    <Form>
                                        <div className="mb-3">
                                            <Form.Check type='checkbox' checked={checkedProducts.map(product => product.id).includes(id)} id='select-all-products-checkbox' label='' onChange={() => handleProductChecked([generatedProductObject], 'single')}/>
                                        </div>
                                    </Form>
                                </td>
                                {Object.entries(productRowValues).map((entry, index2) => <td key={`${index}-${index2}`}>{entry[1]}</td>)}
                                </tr>
                            )    
                        })}
                    </tbody>
                </Table>
                </div>
                </>
                    }
                    </div>
                    {<DataPagination totalNumberOfProducts={totalNumberOfProducts} totalNumberOfFilteredProducts={totalNumberOfFilteredProducts} />}
                    {!waitingForProductsToLoad && userProducts.length === 0 ? <Row>{productHistoryAlert()}</Row> : null}
                    {waitingForProductsToLoad && !hasAlreadyLoadedInitialProducts ? waitingForProductsToLoadSpinner() : null}
                </div>
                </Col>
            </Row>
        )
    } 
    
    const productHistoryAlert = () => {
        const alertMessage = 'No products generated with these filters. Click here or go to the Product Customization page to generate products.'
        return <Col style={{margin: '30px'}}><Alert variant='warning' onClick={() => navigate(`/customizeProduct/configureOptions${search}`)} style={{cursor: 'pointer'}}>{alertMessage}</Alert></Col>
    }

    const waitingForProductsToLoadSpinner = () => {
        return (
            <div>
                <h5>Loading Product Data...</h5>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner> 
            </div>
        )
    }

    const renderProductHistoryViews = () => {
        return (
            <Col>
                <Row>{renderHistoryTable()}</Row>
            </Col>
        )
    }

    return (
        <>
            <h4 style={{marginTop: '80px', paddingBottom: '0px', marginBottom: '0px'}}>Generated Products Data</h4>
            <Col className='my-data-page' style={{marginRight: '20px', marginLeft: '20px'}}>
                <Row className='normal-row'>{renderProductHistoryViews()}</Row>
            </Col>
        </>
    );
}

export default GeneratedProductHistory;