import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Button, ButtonGroup, Input, Overlay, Text } from "@rneui/themed";
import { Dropdown } from "react-native-element-dropdown";
import { Colors } from "@/constants/Colors";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { BarChart } from "react-native-gifted-charts";
import {
    getAllPaymentsPeriod,
    getOldestPayment,
} from "@/services/paymentService";
import { Months } from "@/constants/Months";
import { Icon } from "@rneui/base";
import { SelectCategoriesForStats } from "@/components/SelectCategoriesForStats";

export default function Statistics() {
    const [period, setPeriod] = useState(1);
    const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
    const [periodOptions, setPeriodOptions] = useState<any[] | []>([]);
    const [chartData, setChartData] = useState<
        | {
              value: number;
              name: string;
              frontColor: string;
              amount: number;
          }[]
        | null
    >(null);
    const [total, setTotal] = useState<number>(0);
    const [categoriesModal, setCategoriesModal] = useState(false);

    const periodType = [
        { label: "Monthly", value: 1 },
        { label: "Yearly", value: 2 },
    ];
    const insets = useSafeAreaInsets();

    useEffect(
        useCallback(() => {
            const getChartPayments = async () => {
                if (selectedPeriod != null) {
                    let startMonth, endMonth;
                    if (period == 1) {
                        startMonth = new Date(
                            periodOptions[selectedPeriod].year,
                            periodOptions[selectedPeriod].month,
                            1
                        );
                        endMonth = new Date(
                            periodOptions[selectedPeriod].year,
                            periodOptions[selectedPeriod].month + 1,
                            0
                        );
                    } else {
                        startMonth = new Date(
                            periodOptions[selectedPeriod].year,
                            0,
                            1
                        );
                        endMonth = new Date(
                            periodOptions[selectedPeriod].year + 1,
                            0,
                            0
                        );
                    }
                    const rawData = await getAllPaymentsPeriod(
                        startMonth,
                        endMonth
                    );
                    if (rawData) {
                        const totalSum = Object.values(rawData).reduce(
                            (sum, category) => sum + category.total,
                            0
                        );
                        const data = Object.values(rawData).map((category) => {
                            return {
                                value: (category.total / totalSum) * 100,
                                name: category.name,
                                frontColor: category.color,
                                amount: category.total,
                            };
                        });
                        data.sort((a, b) => b.value - a.value);
                        setChartData(data);
                        setTotal(totalSum);
                    }
                }
            };
            getChartPayments();
        }, [selectedPeriod, period])
    );

    useFocusEffect(
        useCallback(() => {
            const generatePeriods = async () => {
                const oldestDateObj = await getOldestPayment();
                const oldestDate = new Date(oldestDateObj?.date);
                let oldestYear = oldestDate.getFullYear();
                let oldestMonth = oldestDate.getMonth();
                const now = new Date();
                if (period == 1) {
                    let monthPeriods = [];
                    while (
                        oldestYear < now.getFullYear() ||
                        (oldestMonth <= now.getMonth() &&
                            oldestYear <= now.getFullYear())
                    ) {
                        monthPeriods.push({
                            year: oldestYear,
                            month: oldestMonth,
                        });
                        oldestMonth++;
                        oldestYear += Math.floor(oldestMonth / 12);
                        oldestMonth = oldestMonth % 12;
                    }
                    setPeriodOptions(monthPeriods);
                    setSelectedPeriod(monthPeriods.length - 1);
                } else {
                    let yearPeriods = [];
                    while (oldestYear <= now.getFullYear()) {
                        yearPeriods.push({ year: oldestYear });
                        oldestYear++;
                    }
                    setPeriodOptions(yearPeriods);
                    setSelectedPeriod(yearPeriods.length - 1);
                }
                console.log(period);
            };
            generatePeriods();
        }, [period])
    );
    return (
        <>
            <View style={[{ flex: 1, paddingTop: insets.top }]}>
                <View style={styles.rowContainer}>
                    <Dropdown
                        style={styles.dropdownRow}
                        data={periodType}
                        labelField="label"
                        valueField="value"
                        selectedTextProps={{
                            style: { color: Colors.textPrimary, fontSize: 20 },
                        }}
                        value={period}
                        onChange={(item) => setPeriod(item.value)}
                        itemTextStyle={{ color: Colors.textPrimary }}
                        renderItem={(item) => (
                            <Text
                                style={{
                                    padding: 12,
                                    color: Colors.textPrimary,
                                    backgroundColor: Colors.backgroundActive,
                                }}
                            >
                                {item.label}
                            </Text>
                        )}
                        itemContainerStyle={{ borderWidth: 0 }}
                        containerStyle={{
                            borderWidth: 0,
                            backgroundColor: "rgba(0,0,0,0.9)",
                            borderBottomLeftRadius: 12,
                            borderBottomRightRadius: 12,
                            overflow: "hidden",
                        }}
                    />

                    {periodOptions.length > 0 && selectedPeriod != null && (
                        <>
                            <TouchableOpacity
                                disabled={selectedPeriod == 0}
                                onPress={() =>
                                    setSelectedPeriod(selectedPeriod - 1)
                                }
                            >
                                <Icon
                                    name="arrow-bold-left"
                                    type={"entypo"}
                                    color={
                                        selectedPeriod > 0
                                            ? Colors.textPrimary
                                            : Colors.backgroundActive
                                    }
                                />
                            </TouchableOpacity>
                            <View style={styles.dateContainer}>
                                {period == 1 ? (
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={styles.dateStyle}
                                    >
                                        {periodOptions[
                                            selectedPeriod
                                        ].year.toString()}{" "}
                                        -{" "}
                                        {
                                            Months[
                                                periodOptions[selectedPeriod]
                                                    .month
                                            ]?.label
                                        }
                                    </Text>
                                ) : (
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={styles.dateStyle}
                                    >
                                        {periodOptions[selectedPeriod].year}
                                    </Text>
                                )}
                            </View>
                            <TouchableOpacity
                                disabled={
                                    selectedPeriod == periodOptions.length - 1
                                }
                                onPress={() =>
                                    setSelectedPeriod(selectedPeriod + 1)
                                }
                            >
                                <Icon
                                    name="arrow-bold-right"
                                    type={"entypo"}
                                    color={
                                        selectedPeriod !=
                                        periodOptions.length - 1
                                            ? Colors.textPrimary
                                            : Colors.backgroundActive
                                    }
                                />
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {chartData && (
                    <View>
                        <Text style={styles.totalTitle}>
                            Total: {-1 * total} RON
                        </Text>
                        <View
                            style={{
                                alignItems: "flex-start",
                                marginLeft: -20,
                            }}
                            // style={{ backgroundColor: "white" }}
                        >
                            <BarChart
                                width={330}
                                height={200}
                                horizontal
                                barWidth={22}
                                barBorderRadius={6}
                                data={chartData}
                                yAxisThickness={0}
                                xAxisThickness={0}
                                yAxisLabelWidth={30}
                                //xAxisLabelsHeight={0}
                                yAxisTextStyle={{
                                    color: "white",
                                    fontSize: 12,
                                    textAlign: "right", // pentru ca textul să fie lipit de marginea barei
                                }}
                                xAxisLabelTextStyle={{
                                    color: "white",
                                    fontSize: 20,
                                }}
                                noOfSections={8}
                                spacing={25}
                                // xAxisColor={"#333"}
                                // yAxisColor={"#333"}
                                // rulesColor={"#444444ff"}
                                renderTooltip={(item) => (
                                    <View
                                        style={{
                                            padding: 6,
                                            backgroundColor: "#222",
                                            borderRadius: 6,
                                            overflow: "visible",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "white",
                                                fontSize: 18,
                                            }}
                                        >
                                            {item.amount} RON
                                        </Text>
                                    </View>
                                )}
                            />
                        </View>
                        <View
                            style={{
                                height: 250,
                                marginTop: -30,
                                marginHorizontal: 20,
                            }}
                        >
                            <ScrollView>
                                {chartData.map((category, x) => {
                                    return (
                                        <View
                                            key={x}
                                            style={[
                                                styles.itemRow,
                                                x == chartData.length - 1 && {
                                                    borderBottomWidth: 0,
                                                },
                                            ]}
                                        >
                                            <View
                                                style={styles.categoryContainer}
                                            >
                                                <View
                                                    style={[
                                                        styles.circle,
                                                        {
                                                            backgroundColor:
                                                                category.frontColor,
                                                        },
                                                    ]}
                                                />
                                                <View
                                                    style={
                                                        styles.categoryTextContainer
                                                    }
                                                >
                                                    <Text style={styles.text}>
                                                        {category.name}
                                                    </Text>
                                                    <Text style={styles.date}>
                                                        {category.amount} RON
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text style={styles.amount}>
                                                {category.value.toFixed(2)} %
                                            </Text>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>
                )}
                <View>
                    <Button
                        onPress={() => setCategoriesModal(true)}
                        buttonStyle={styles.saveButton}
                        title="Select categories"
                    />
                    <SelectCategoriesForStats
                        modal={categoriesModal}
                        setModal={setCategoriesModal}
                    />
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap", // să nu depășească ecranul pe mobil
        marginHorizontal: 10,
        marginVertical: 10,
        fontSize: 20,
    },
    dropdownRow: {
        width: 110,
        height: 50,
        borderRadius: 30,
        paddingRight: 15,
        borderWidth: 0,
    },
    dateContainer: {
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap", // să nu depășească ecranul pe mobil
        marginHorizontal: 10,
        marginVertical: 10,
        fontSize: 20,
        backgroundColor: Colors.backgroundActive,
        borderRadius: 30,
        width: 200,
        height: 40,
        paddingHorizontal: 3,
    },
    dateStyle: {
        color: Colors.textPrimary,
        fontSize: 20,
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.textPrimary,
    },
    categoryContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
        borderColor: Colors.textSecondary,
        borderWidth: 1,
    },
    text: {
        fontSize: 20,
        fontWeight: "500",
        color: Colors.textPrimary,
    },
    amount: {
        fontSize: 18,
        fontWeight: "500",
        color: Colors.textPrimary,
    },
    categoryTextContainer: {
        flexDirection: "column",
        alignItems: "flex-start", // textul aliniat stânga lângă cerc
    },
    date: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    totalTitle: {
        alignSelf: "center",
        fontWeight: "semibold",
        fontSize: 20,
        color: Colors.textPrimary,
        marginBottom: -20,
    },
    saveButton: {
        backgroundColor: Colors.backgroundActive,
        borderRadius: 8,
        paddingVertical: 10,
        margin: 20,
        marginTop: 30,
    },
});
