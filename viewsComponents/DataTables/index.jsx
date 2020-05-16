import React from "react";
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";

const DataTables = ({
  data,
  key,
  translation,
  title,
  options,
  columns,
  className,
}) => {
  // console.log("datatable data", data);
  // console.log("datatable columns", columns);
  const defaultOptions = {
    selectableRows: "none",
    responsive: "stacked",
    print: false,
    download: true,
    textLabels: {
      body: {
        noMatch: "Lo sentimos, no hay resultados",
        toolTip: "Ordenar",
      },
      pagination: {
        next: "Siguente",
        previous: "Anterior",
        rowsPerPage: "Filas por página:",
        displayRows: "de",
      },
      toolbar: {
        search: "Buscar",
        downloadCsv: "Descargar CSV",
        print: "Imprimir",
        viewColumns: "Ver Columnas",
        filterTable: "Filtrar Tabla",
      },
      filter: {
        all: "Todos",
        title: "FILTROS",
        reset: "RESETEAR",
      },
      viewColumns: {
        title: "Mostrar Columnas",
        titleAria: "Mostrar/Ocultar Columnas de la tabla",
      },
      selectedRows: {
        text: "Columna(s) seleccionadas",
        delete: "Borrar",
        deleteAria: "Borrar Columnas Seleccionadas",
      },
    },
  };
  return (
    <MUIDataTable
      key={key}
      data={data}
      columns={columns || []}
      options={defaultOptions}
      className={className}
    />
  );
};

export { DataTables };
