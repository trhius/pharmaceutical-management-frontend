import { useState, useEffect } from 'react';

import { Fallback } from 'src/routes/fallback';

import { useGetAllStoresQuery } from 'src/app/api/store/storeApiSlice';

import { StoreCreationForm } from 'src/components/form/store-creation-form';

import { Select } from './custom-select';

// ----------------------------------------------------------
type StoreSelectProps = {
  store: any;
  defaultStore?: any;
  setStore: (store: any) => void;
  inputStyle?: boolean;
  error?: string;
  setError?: (error: string) => void;
};

export function StoreSelect({
  store,
  setStore,
  defaultStore,
  inputStyle,
  error,
  setError,
}: StoreSelectProps) {
  const { data: storesData, isLoading } = useGetAllStoresQuery({});

  const [storeConfigs, setStoreConfigs] = useState<any>([]);

  const [storePopupOpen, setStorePopupOpen] = useState(false);
  const [storeUpdatePopupOpen, setStoreUpdatePopupOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState();

  useEffect(() => {
    if (storesData) {
      const configs = storesData?.map((s: any) => ({ label: s.name, value: s.id }));
      setStoreConfigs(configs);

      if (defaultStore) {
        setStore(configs?.find((s: any) => s.value === Number(defaultStore)));
      }
    }
  }, [storesData, defaultStore, setStore]);

  if (isLoading) {
    return <Fallback />;
  }

  return (
    <>
      <Select
        inputStyle={inputStyle}
        title="Chi nhánh"
        options={storeConfigs ?? []}
        selected={store}
        setSelected={setStore}
        handleAddEvent={() => setStorePopupOpen(true)}
        handleEditOption={(option: any) => {
          const storeToEdit = storesData?.find((s: any) => s.id === option.value);
          if (storeToEdit) {
            setSelectedStore(storeToEdit);
          }
          setStoreUpdatePopupOpen(true);
        }}
        error={error}
        setError={setError}
      />
      <StoreCreationForm
        popupOpen={storePopupOpen}
        setPopupOpen={setStorePopupOpen}
        title="New Store"
      />
      <StoreCreationForm
        popupOpen={storeUpdatePopupOpen}
        setPopupOpen={setStoreUpdatePopupOpen}
        title="Update Store"
        editData={selectedStore}
      />
    </>
  );
}
