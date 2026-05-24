import { EnterpriseAssuranceFeaturePage, makeEnterpriseAssuranceServerSideProps } from '../../features/enterprise-assurance/enterprise-assurance-feature-page';
export const getServerSideProps = makeEnterpriseAssuranceServerSideProps('warehouseCapacityHeatmap');
export default EnterpriseAssuranceFeaturePage;
