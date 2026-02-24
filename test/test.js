import React from "react";
import { Keyboard, Platform, View } from "react-native";
import RNPickerSelect from "../src";

const selectItems = [
  {
    label: "Red",
    value: "red",
  },
  {
    label: "Orange",
    value: "orange",
  },
  {
    label: "Yellow",
    value: "yellow",
  },
  {
    label: "Green",
    value: "green",
  },
  {
    label: "Blue",
    value: "blue",
  },
  {
    label: "Indigo",
    value: "indigo",
  },
];

const objectSelectItems = [
  {
    label: "Red",
    value: { label: "red" },
  },
  {
    label: "Orange",
    value: { label: "orange" },
  },
  {
    label: "Yellow",
    value: { label: "yellow" },
  },
  {
    label: "Green",
    value: { label: "green" },
  },
  {
    label: "Blue",
    value: { label: "blue" },
  },
  {
    label: "Indigo",
    value: { label: "indigo" },
  },
];

const violet = { label: "Violet", value: "violet" };

const placeholder = {
  label: "Select a color...",
  value: null,
};

const noop = () => {};

describe("RNPickerSelect", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(Keyboard, "dismiss");
  });

  describe("when provided an itemKey prop", () => {
    it("sets the selected item via key rather than value", () => {
      const items = [
        {
          label: "+1 Canada",
          value: 1,
          key: "canada",
        },
        {
          label: "+1 USA",
          value: 1,
          key: "usa",
        },
      ];

      const wrapper = shallow(
        <RNPickerSelect
          items={items}
          placeholder={placeholder}
          itemKey="usa"
          value={1}
          onValueChange={noop}
        />,
      );

      expect(wrapper.state().selectedItem.key).toEqual("usa");
    });
  });

  it("should set the selected value to state", () => {
    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        placeholder={placeholder}
        onValueChange={noop}
      />,
    );

    wrapper.find('[testID="ios_picker"]').props().onValueChange("orange", 2);
    wrapper.find('[testID="ios_picker"]').props().onValueChange("yellow", 3);
    expect(wrapper.state().selectedItem.value).toEqual("yellow");
  });

  it("should not return the default InputAccessoryView if custom component is passed in", () => {
    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        placeholder={placeholder}
        onValueChange={noop}
        InputAccessoryView={() => {
          return <View />;
        }}
      />,
    );

    const input_accessory_view = wrapper.find(
      '[testID="input_accessory_view"]',
    );
    const custom_input_accessory_view = wrapper.find(
      '[testID="custom_input_accessory_view"]',
    );

    expect(input_accessory_view).toHaveLength(0);
    expect(custom_input_accessory_view).toHaveLength(1);
  });

  it("should update the orientation state when onOrientationChange is called", () => {
    const wrapper = shallow(<RNPickerSelect items={[]} onValueChange={noop} />);

    expect(wrapper.state().orientation).toEqual("portrait");

    wrapper
      .instance()
      .onOrientationChange({ nativeEvent: { orientation: "landscape" } });

    expect(wrapper.state().orientation).toEqual("landscape");
  });

  it("should handle an empty items array", () => {
    const wrapper = shallow(
      <RNPickerSelect items={[]} placeholder={{}} onValueChange={noop} />,
    );

    expect(wrapper.state().items).toHaveLength(0);
  });

  it("should return the expected option to a callback passed into onSelect", () => {
    const onValueChangeSpy = jest.fn();
    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        placeholder={placeholder}
        onValueChange={onValueChangeSpy}
      />,
    );

    wrapper.find('[testID="ios_picker"]').props().onValueChange("orange", 2);
    expect(onValueChangeSpy).toHaveBeenCalledWith("orange", 2);
  });

  it("should return the expected option to a callback passed into onSelect when the value is an object", () => {
    const onValueChangeSpy = jest.fn();
    const wrapper = shallow(
      <RNPickerSelect
        items={objectSelectItems}
        placeholder={placeholder}
        onValueChange={onValueChangeSpy}
      />,
    );

    wrapper
      .find('[testID="ios_picker"]')
      .props()
      .onValueChange(objectSelectItems[5].value, 5);
    expect(onValueChangeSpy).toHaveBeenCalledWith(
      objectSelectItems[5].value,
      5,
    );
  });

  it("should show the picker when pressed", () => {
    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        placeholder={placeholder}
        onValueChange={noop}
      />,
    );

    const touchable = wrapper.find("TouchableOpacity").at(1);
    touchable.simulate("press");
    expect(wrapper.state().showPicker).toEqual(true);
  });

  it("should not show the picker when pressed if disabled", () => {
    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        placeholder={placeholder}
        onValueChange={noop}
        disabled
      />,
    );

    const touchable = wrapper.find("TouchableOpacity").at(1);
    touchable.simulate("press");
    expect(wrapper.state().showPicker).toEqual(false);
  });

  it('should show the value "RED" in the TextInput instead of the label "Red" when the inputLabel is set', () => {
    const items = [
      {
        label: "Red",
        value: "red",
        inputLabel: "RED",
      },
      {
        label: "Orange",
        value: "orange",
      },
    ];

    const wrapper = shallow(
      <RNPickerSelect
        items={items}
        placeholder={{}}
        onValueChange={noop}
        value="red"
      />,
    );

    const textInput = wrapper.find('[testID="text_input"]');

    expect(textInput.props().value).toEqual("RED");
  });

  it("should update the selected value when the `value` prop updates and call the onValueChange cb", () => {
    const onValueChangeSpy = jest.fn();
    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        placeholder={{}}
        onValueChange={onValueChangeSpy}
        value="red"
      />,
    );

    expect(wrapper.state().selectedItem.value).toEqual("red");

    wrapper.setProps({ value: "orange" });
    expect(onValueChangeSpy).toBeCalledWith("orange", 1);
    expect(wrapper.state().selectedItem.value).toEqual("orange");

    wrapper.setProps({ value: "yellow" });
    expect(onValueChangeSpy).toBeCalledWith("yellow", 2);
    expect(wrapper.state().selectedItem.value).toEqual("yellow");
  });

  it("should update the items when the `items` prop updates", () => {
    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        placeholder={placeholder}
        onValueChange={noop}
      />,
    );

    expect(wrapper.state().items).toEqual([placeholder].concat(selectItems));

    const selectItemsPlusViolet = selectItems.concat([violet]);

    wrapper.setProps({ items: selectItemsPlusViolet });
    expect(wrapper.state().items).toEqual(
      [placeholder].concat(selectItemsPlusViolet),
    );
  });

  it("should should handle having no placeholder", () => {
    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        placeholder={{}}
        onValueChange={noop}
      />,
    );

    expect(wrapper.state().items).toEqual(selectItems);
  });

  it("should should show the icon container the Icon prop receives a component", () => {
    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        onValueChange={noop}
        Icon={() => {
          return <View />;
        }}
      />,
    );

    expect(wrapper.find('[testID="icon_container"]')).toHaveLength(1);
  });

  it("should should not show the icon container when the Icon prop is empty", () => {
    const wrapper = shallow(
      <RNPickerSelect items={selectItems} onValueChange={noop} />,
    );

    expect(wrapper.find('[testID="icon_container"]')).toHaveLength(0);
  });

  it("should call Keyboard.dismiss when opened", () => {
    const wrapper = shallow(
      <RNPickerSelect items={selectItems} onValueChange={noop} />,
    );

    const touchable = wrapper.find('[testID="ios_touchable_wrapper"]');
    touchable.simulate("press");

    expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
  });

  it("should reset to the first item (typically the placeholder) if a value is passed in that doesn't exist in the `items` array", () => {
    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        placeholder={placeholder}
        onValueChange={noop}
        value={undefined}
      />,
    );

    wrapper.find('[testID="ios_picker"]').props().onValueChange("orange", 2);
    expect(wrapper.state().selectedItem.value).toEqual("orange");
    wrapper.setProps({ value: "violet" });
    expect(wrapper.state().selectedItem).toEqual(placeholder);
  });

  it("should set the selected value to state (Android)", () => {
    Platform.OS = "android";
    const wrapper = shallow(
      <RNPickerSelect items={selectItems} onValueChange={noop} />,
    );

    wrapper
      .find('[testID="android_picker"]')
      .props()
      .onValueChange("orange", 2);
    expect(wrapper.state().selectedItem.value).toEqual("orange");
  });

  it("should render the headless component when a child is passed in (Android)", () => {
    Platform.OS = "android";
    const wrapper = shallow(
      <RNPickerSelect items={selectItems} onValueChange={noop}>
        <View />
      </RNPickerSelect>,
    );

    const component = wrapper.find('[testID="android_picker_headless"]');
    expect(component).toHaveLength(1);
  });

  it("should set the selected value to state (Web)", () => {
    Platform.OS = "web";
    const wrapper = shallow(
      <RNPickerSelect items={selectItems} onValueChange={noop} />,
    );

    wrapper.find('[testID="web_picker"]').props().onValueChange("orange", 2);
    expect(wrapper.state().selectedItem.value).toEqual("orange");
  });

  it("should call the onDonePress callback when set (iOS)", () => {
    Platform.OS = "ios";
    const onDonePressSpy = jest.fn();
    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        onValueChange={noop}
        onDonePress={onDonePressSpy}
      />,
    );

    wrapper.find('[testID="done_button"]').simulate("press");

    expect(onDonePressSpy).toHaveBeenCalledWith();
    expect(onDonePressSpy).toHaveBeenCalledTimes(1);
  });

  it("should update the Done styling during a press (iOS)", () => {
    Platform.OS = "ios";
    const wrapper = shallow(
      <RNPickerSelect items={selectItems} onValueChange={noop} />,
    );

    const done_button = wrapper.find('[testID="done_button"]');

    done_button.simulate("pressIn");
    expect(wrapper.state().doneDepressed).toEqual(true);

    done_button.simulate("pressOut");
    expect(wrapper.state().doneDepressed).toEqual(false);
  });

  it("should call the onShow callback when set (iOS)", () => {
    Platform.OS = "ios";
    const onShowSpy = jest.fn();
    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        onValueChange={noop}
        modalProps={{
          onShow: onShowSpy,
        }}
      />,
    );
    wrapper.find('[testID="ios_modal"]').props().onShow();
    expect(onShowSpy).toHaveBeenCalledWith();
  });

  it("should call the onDismiss callback when set (iOS)", () => {
    Platform.OS = "ios";
    const onDismissSpy = jest.fn();
    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        onValueChange={noop}
        modalProps={{
          onDismiss: onDismissSpy,
        }}
      />,
    );
    wrapper.find('[testID="ios_modal"]').props().onDismiss();
    expect(onDismissSpy).toHaveBeenCalledWith();
  });

  it("should call the onOpen callback when set (iOS)", () => {
    Platform.OS = "ios";
    const onOpenSpy = jest.fn();
    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        onValueChange={noop}
        onOpen={onOpenSpy}
      />,
    );

    const touchable = wrapper.find('[testID="ios_touchable_wrapper"]');
    touchable.simulate("press");

    expect(onOpenSpy).toHaveBeenCalledWith();
  });

  it("should call the onOpen callback when set (Android)", () => {
    Platform.OS = "android";
    const onOpenSpy = jest.fn();
    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        onValueChange={noop}
        onOpen={onOpenSpy}
        useNativeAndroidPickerStyle={false}
      />,
    );

    const touchable = wrapper.find('[testID="android_touchable_wrapper"]');
    touchable.simulate("press");

    expect(onOpenSpy).toHaveBeenCalledWith();
  });

  it("should use a View when fixAndroidTouchableBug=true (Android)", () => {
    Platform.OS = "android";
    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        onValueChange={noop}
        useNativeAndroidPickerStyle={false}
        fixAndroidTouchableBug
      />,
    );

    const touchable = wrapper.find('[testID="android_touchable_wrapper"]');

    expect(touchable.type().displayName).toEqual("View");
  });

  describe("Android headless mode accessibility", () => {
    beforeEach(() => {
      Platform.OS = "android";
    });

    it("should have accessibility props on the wrapper (Android headless)", () => {
      const wrapper = shallow(
        <RNPickerSelect
          items={selectItems}
          onValueChange={noop}
          useNativeAndroidPickerStyle={false}
          pickerProps={{
            accessibilityLabel: "Select an item",
          }}
        />,
      );

      const touchable = wrapper.find('[testID="android_touchable_wrapper"]');

      expect(touchable.props().accessible).toEqual(true);
      expect(touchable.props().accessibilityRole).toEqual("combobox");
      expect(touchable.props().accessibilityLabel).toEqual("Select an item");
      expect(touchable.props().accessibilityState).toEqual({ disabled: false });
      expect(touchable.props().accessibilityActions).toEqual([
        { name: "activate" },
      ]);
      expect(touchable.props().onAccessibilityAction).toBeDefined();
    });

    it("should use accessibilityLabel from pickerProps (Android headless)", () => {
      const wrapper = shallow(
        <RNPickerSelect
          items={selectItems}
          placeholder={{}}
          onValueChange={noop}
          useNativeAndroidPickerStyle={false}
          value="orange"
          pickerProps={{
            accessibilityLabel: "Choose a color",
          }}
        />,
      );

      const touchable = wrapper.find('[testID="android_touchable_wrapper"]');

      expect(touchable.props().accessibilityLabel).toEqual("Choose a color");
    });

    it("should have undefined accessibilityLabel when not provided via pickerProps (Android headless)", () => {
      const wrapper = shallow(
        <RNPickerSelect
          items={selectItems}
          placeholder={{}}
          onValueChange={noop}
          useNativeAndroidPickerStyle={false}
          value="orange"
        />,
      );

      const touchable = wrapper.find('[testID="android_touchable_wrapper"]');

      expect(touchable.props().accessibilityLabel).toBeUndefined();
    });

    it("should have importantForAccessibility on inner container (Android headless)", () => {
      const wrapper = shallow(
        <RNPickerSelect
          items={selectItems}
          onValueChange={noop}
          useNativeAndroidPickerStyle={false}
        />,
      );

      const touchable = wrapper.find('[testID="android_touchable_wrapper"]');
      const innerContainer = touchable.children().first();

      expect(innerContainer.props().importantForAccessibility).toEqual(
        "no-hide-descendants",
      );
    });

    it("should not trigger picker when disabled and accessibility action is called (Android headless)", () => {
      const wrapper = shallow(
        <RNPickerSelect
          items={selectItems}
          onValueChange={noop}
          useNativeAndroidPickerStyle={false}
          disabled
        />,
      );

      const touchable = wrapper.find('[testID="android_touchable_wrapper"]');
      const onAccessibilityAction = touchable.props().onAccessibilityAction;

      // This should not throw and should be a no-op when disabled
      expect(() => {
        onAccessibilityAction({ nativeEvent: { actionName: "activate" } });
      }).not.toThrow();
    });

    it("should set accessibilityState.disabled to true when disabled (Android headless)", () => {
      const wrapper = shallow(
        <RNPickerSelect
          items={selectItems}
          onValueChange={noop}
          useNativeAndroidPickerStyle={false}
          disabled
        />,
      );

      const touchable = wrapper.find('[testID="android_touchable_wrapper"]');

      expect(touchable.props().accessibilityState).toEqual({ disabled: true });
    });

    it('should call pickerRef.focus() when accessibility action "activate" is triggered (Android headless)', () => {
      const mockFocus = jest.fn();
      const mockRef = { current: { focus: mockFocus } };

      const wrapper = shallow(
        <RNPickerSelect
          items={selectItems}
          onValueChange={noop}
          useNativeAndroidPickerStyle={false}
          pickerProps={{ ref: mockRef }}
        />,
      );

      const touchable = wrapper.find('[testID="android_touchable_wrapper"]');
      const onAccessibilityAction = touchable.props().onAccessibilityAction;

      onAccessibilityAction({ nativeEvent: { actionName: "activate" } });

      expect(mockFocus).toHaveBeenCalledTimes(1);
    });

    it("should not call pickerRef.focus() for non-activate actions (Android headless)", () => {
      const mockFocus = jest.fn();
      const mockRef = { current: { focus: mockFocus } };

      const wrapper = shallow(
        <RNPickerSelect
          items={selectItems}
          onValueChange={noop}
          useNativeAndroidPickerStyle={false}
          pickerProps={{ ref: mockRef }}
        />,
      );

      const touchable = wrapper.find('[testID="android_touchable_wrapper"]');
      const onAccessibilityAction = touchable.props().onAccessibilityAction;

      onAccessibilityAction({ nativeEvent: { actionName: "longpress" } });

      expect(mockFocus).not.toHaveBeenCalled();
    });
  });

  it("should call the onClose callback when set", () => {
    Platform.OS = "ios";
    const onCloseSpy = jest.fn();
    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        onValueChange={noop}
        onClose={onCloseSpy}
      />,
    );

    const touchable = wrapper.find('[testID="done_button"]');
    // Open
    touchable.simulate("press");
    // Close
    touchable.simulate("press");

    expect(onCloseSpy).toHaveBeenCalledWith(true);
  });

  it("should close the modal when the empty area above the picker is tapped", () => {
    const wrapper = shallow(
      <RNPickerSelect items={selectItems} onValueChange={noop} />,
    );

    jest.spyOn(wrapper.instance(), "togglePicker");

    const touchable = wrapper.find('[testID="ios_modal_top"]');
    touchable.simulate("press");

    expect(wrapper.instance().togglePicker).toHaveBeenCalledWith(true);
  });

  it("should use the dark theme when `darkTheme` prop is provided on iOS", () => {
    Platform.OS = "ios";

    const wrapper = shallow(
      <RNPickerSelect items={selectItems} onValueChange={noop} darkTheme />,
    );

    const input_accessory_view = wrapper.find(
      '[testID="input_accessory_view"]',
    );
    const darkThemeStyle = input_accessory_view.get(0).props.style[1];

    expect(darkThemeStyle).toHaveProperty("backgroundColor", "#232323");
  });

  // TODO - fix
  xdescribe("getDerivedStateFromProps", () => {
    it("should return null when nothing changes", () => {
      const nextProps = {
        placeholder,
        value: selectItems[0].value,
        onValueChange() {},
        items: selectItems,
      };
      const prevState = {
        items: [placeholder].concat(selectItems),
        selectedItem: selectItems[0],
      };

      expect(
        RNPickerSelect.getDerivedStateFromProps(nextProps, prevState),
      ).toEqual(null);
    });

    it("should return a new items state when the items change", () => {
      const nextProps = {
        placeholder,
        value: selectItems[0].value,
        onValueChange() {},
        items: selectItems.concat([violet]),
      };
      const prevState = {
        items: [placeholder].concat(selectItems),
        selectedItem: selectItems[0],
      };

      expect(
        RNPickerSelect.getDerivedStateFromProps(nextProps, prevState),
      ).toEqual({
        items: [placeholder].concat(selectItems).concat([violet]),
      });
    });

    it("should return a new items state when the placeholder changes", () => {
      const newPlaceholder = {
        label: "Select a thing...",
        value: null,
      };
      const nextProps = {
        placeholder: newPlaceholder,
        value: selectItems[0].value,
        onValueChange() {},
        items: selectItems,
      };
      const prevState = {
        items: [placeholder].concat(selectItems),
        selectedItem: selectItems[0],
      };

      expect(
        RNPickerSelect.getDerivedStateFromProps(nextProps, prevState),
      ).toEqual({
        items: [newPlaceholder].concat(selectItems),
      });
    });

    it("should return a new selectedItem state when the value changes", () => {
      const nextProps = {
        placeholder,
        value: selectItems[1].value,
        onValueChange() {},
        items: selectItems,
      };
      const prevState = {
        items: [placeholder].concat(selectItems),
        selectedItem: selectItems[0],
      };

      expect(
        RNPickerSelect.getDerivedStateFromProps(nextProps, prevState),
      ).toEqual({
        selectedItem: selectItems[1],
      });
    });
  });

  it("should apply custom styles to dropdown items", () => {
    const customDropdownItemStyle = {
      backgroundColor: "#d0d4da",
      color: "#000",
    };

    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        placeholder={placeholder}
        onValueChange={noop}
        dropdownItemStyle={customDropdownItemStyle}
      />,
    );

    wrapper.find('[testID="ios_touchable_wrapper"]').simulate("press");

    const pickerItems = wrapper.find("Picker").find("Picker.Item");

    pickerItems.forEach((item) => {
      expect(item.props().style).toEqual(customDropdownItemStyle);
    });
  });

  it("should apply custom styles to the active dropdown item", () => {
    const customActiveItemStyle = {
      backgroundColor: "#d0d4da",
      color: "#000",
    };

    const selectItems = [
      { label: "Item 1", value: "item1", key: "1" },
      { label: "Item 2", value: "item2", key: "2" },
    ];

    const placeholder = { label: "Select an item...", value: null };

    const wrapper = shallow(
      <RNPickerSelect
        items={selectItems}
        placeholder={placeholder}
        onValueChange={() => {}}
        activeItemStyle={customActiveItemStyle}
        value="item2" // Select "Item 2"
      />,
    );

    // Open the picker
    wrapper.find('[testID="ios_touchable_wrapper"]').simulate("press");

    // Find picker items
    const pickerItems = wrapper.find("Picker").find("PickerItem");

    // Ensure picker items are found
    expect(pickerItems.length).toBeGreaterThan(0);

    // Check if the active item has the custom styles
    const activeItem = pickerItems.findWhere(
      (item) => item.prop("value") === "item2",
    );

    // Ensure activeItem is found
    expect(activeItem.exists()).toBe(true);

    // Check styles applied to the active item
    expect(activeItem.prop("style")).toEqual(customActiveItemStyle);
  });
});
