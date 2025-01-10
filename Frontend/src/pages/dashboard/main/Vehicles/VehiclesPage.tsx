import React, { useState } from 'react';
import { useGetResourcesQuery, Resource } from '../../../../features/resources/resourcesAPI';
import CreateResourceButton from './CreateResourceButton';
import CreateResourceModal from './CreateResourceModal';
import EditResourceModal from './EditResourceModal';
import DeleteResourceModal from './DeleteResourceModal';
import TagBadge from '../../../../components/TagBadge';
import { SyncLoader } from 'react-spinners';

const ResourcesPage: React.FC = () => {
  const { data: resources, isLoading, error } = useGetResourcesQuery();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const openCreateModal = () => setCreateModalOpen(true);
  const closeCreateModal = () => setCreateModalOpen(false);

  const handleEditClick = (resource: Resource) => {
    setSelectedResource(resource);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (resource: Resource) => {
    setSelectedResource(resource);
    setDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <SyncLoader color={"#37B7C3"} size={20} />
        </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-lg text-red-500">Error loading resources: {error.toString()}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 lg:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Resources</h1>
        <CreateResourceButton onOpenModal={openCreateModal} />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:mx-4">
        {resources?.map((resource: Resource) => (
          <li key={resource.resource_id} className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
            <img
              src={resource.resource_image}
              alt="Resource banner"
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-semibold text-white mb-4">{resource.resource_name}</h2>
            <p className="text-white mb-2 flex items-center justify-between"><strong>About:</strong>{resource.resource_description}</p>
              <strong>Link: </strong>{' '}
            <div className="flex flex-col items-center justify-evenly">
              <div className="flex flex-wrap mt-2">
                <a href={resource.resource_link} className="text-blue-500 hover:underline">
                  {resource.resource_link}
                </a>
              </div>
            </div>
            <div className="text-sm text-white mb-2 flex items-center justify-between">
              <strong>Category:</strong>{' '}
              <div className=" mt-2">
                {resource.track.map((category) => (
                  <TagBadge key={category} tag={category} />
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-6 space-x-4">
              <button
                onClick={() => handleEditClick(resource)}
                className="bg-blue-500 p-2 text-white w-[100px] rounded hover:text-blue-700 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(resource)}
                className="bg-red-500 p-2 text-white w-[100px] rounded hover:text-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isCreateModalOpen && <CreateResourceModal onClose={closeCreateModal} />}

      {isEditModalOpen && selectedResource && (
        <EditResourceModal
          resource={selectedResource}
          onClose={() => setEditModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && selectedResource && (
        <DeleteResourceModal
          resourceId={selectedResource.resource_id}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ResourcesPage;