import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ListOrdered } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const sortOrderOptions = [
  { value: 'ASC', label: 'Tăng dần' },
  { value: 'DESC', label: 'Giảm dần' },
];

interface SortableColumn {
  value: string;
  label: string;
}

interface SortDropdownProps {
  sortableColumns: SortableColumn[];
  currentSortBy: string | undefined;
  currentSortOrder: 'ASC' | 'DESC' | undefined; // Assuming 'ASC' | 'DESC'
  setSortBy: (sortBy: string | undefined) => void;
  setSortOrder: (sortOrder: 'ASC' | 'DESC' | undefined) => void;
}

export function SortDropdown({
  sortableColumns,
  currentSortBy,
  currentSortOrder,
  setSortBy,
  setSortOrder,
}: SortDropdownProps) {
  // Placeholder value for the "No sorting" option in the Select
  const NONE_SORT_VALUE = '__NONE__';

  // Internal state to manage dropdown UI (optional, could directly use props)
  // Using props directly is simpler if we don't need local intermediate state
  // const [selectedSortBy, setSelectedSortBy] = useState<string | undefined>(currentSortBy);
  // const [selectedSortOrder, setSelectedSortOrder] = useState<'ASC' | 'DESC' | undefined>(currentSortOrder);

  // useEffect(() => {
  //   setSelectedSortBy(currentSortBy);
  //   setSelectedSortOrder(currentSortOrder);
  // }, [currentSortBy, currentSortOrder]);

  const handleSortByChange = (value: string) => {
    const newValue = value === NONE_SORT_VALUE ? undefined : value;
    setSortBy(newValue);
    // If column is selected but order isn't, default to ASC
    if (newValue !== undefined && !currentSortOrder) {
      setSortOrder('ASC');
    }
    // If column is cleared, clear order too
    if (newValue === undefined) {
      setSortOrder(undefined);
    }
  };

  const handleSortOrderChange = (value: 'ASC' | 'DESC') => {
    setSortOrder(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ListOrdered className="mr-2 h-4 w-4" />
          Sắp xếp
          {(currentSortBy || currentSortOrder) && ( // Show active sort indicator
            <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-4" align="end">
        {' '}
        {/* Added padding and align */}
        <DropdownMenuLabel>Sắp xếp theo</DropdownMenuLabel>
        {/* Select for SortBy */}
        <Select
          value={currentSortBy || NONE_SORT_VALUE} // Use placeholder value
          onValueChange={handleSortByChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn cột" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_SORT_VALUE}>-- Mặc định --</SelectItem> {/* Use the non-empty placeholder value */}
            {sortableColumns.map((col) => (
              <SelectItem key={col.value} value={col.value}>
                {col.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DropdownMenuSeparator className="my-4" /> {/* Separator */}
        <DropdownMenuLabel>Thứ tự</DropdownMenuLabel>
        {/* Radio Group for SortOrder */}
        <RadioGroup
          value={currentSortOrder || ''} // Use empty string if sortOrder is undefined for RadioGroup
          onValueChange={(value: string) => handleSortOrderChange(value as 'ASC' | 'DESC')} // Cast value
          className="flex flex-col gap-2"
          disabled={!currentSortBy} // Disable if no sort column is selected
        >
          {sortOrderOptions.map((order) => (
            <div key={order.value} className="flex items-center space-x-2">
              <RadioGroupItem value={order.value} id={`sort-order-${order.value}`} />
              <Label htmlFor={`sort-order-${order.value}`}>{order.label}</Label>
            </div>
          ))}
        </RadioGroup>
        {/* Note: No explicit Apply button needed, changes apply immediately */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
