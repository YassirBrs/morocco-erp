import { EnterpriseAccelerationFeaturePage, makeEnterpriseAccelerationServerSideProps } from '../../features/enterprise-acceleration/enterprise-acceleration-feature-page';

export const getServerSideProps = makeEnterpriseAccelerationServerSideProps('projectCloseout');

export default EnterpriseAccelerationFeaturePage;
