import { EnterpriseAccelerationFeaturePage, makeEnterpriseAccelerationServerSideProps } from '../../features/enterprise-acceleration/enterprise-acceleration-feature-page';

export const getServerSideProps = makeEnterpriseAccelerationServerSideProps('priceIncreaseCommunication');

export default EnterpriseAccelerationFeaturePage;
