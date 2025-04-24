import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, List, Avatar, Select, Upload, Image, message, InputNumber } from "antd";
import { PlusOutlined,  
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined, 
  SearchOutlined, 
  MessageOutlined, 
  UploadOutlined, 
  SmileOutlined } from "@ant-design/icons";
import { BASE_URL_IMAGE } from "../api/configs";
import { requestWithAuth } from "../api/token";
import { getProducts, addProduct, updateProduct, changeProductStatus } from "../api/product";
import { addCategory, getCategories, toggleCategoryStatus, updateCategory } from "../api/category"; 
const { Option } = Select;
const { Search } = Input;

const Food = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [isEditCategoryModalVisible, setIsEditCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm] = Form.useForm();
  const [selectedFood, setSelectedFood] = useState(null);
  const [reply, setReply] = useState("");
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [foodForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response);
      console.log("sp trả về", response);
      const categoryList = [
        ...new Map(
          response.map((item) => [
            item.categoryModel?.id,
            {
              id: item.categoryModel?.id,
              name: item.categoryModel?.category,
              sale: item.categoryModel?.sale ?? 0,
            },
          ])
        ).values(),
      ];
      setCategories(categoryList);

      const filtered = response
      .map((item) => ({
        ...item,
        idCategory: item.categoryModel?.id,
        category: item.categoryModel?.category || "Không rõ",
        sale: item.categoryModel?.sale ?? 0, // ✅ chính xác ở đây
        sold: item.totalProductSold ?? 0,
        revenue: item.totalRevenue ?? 0,
      }))
      .filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase())
      );
    
        console.log("✅ filteredData sau xử lý:", filtered);
      setFilteredData(filtered);
    } catch (error) {
      message.error("Không thể tải dữ liệu sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  
  const fetchCategories = async () => {
    try {
      const response = await getCategories();

      if (!Array.isArray(response)) {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }

      const mapped = response.map((item) => ({
        id: item.id,
        name: item.category, 
        sale: item.sale,
        status: item.status,
      }));

      setCategories(mapped);
    } catch (error) {
      console.error("Lỗi fetchCategories:", error);
      message.error("❌ Không lấy được danh mục món ăn");
    }
  };
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchText]);

  const handleUploadChange = ({ file }) => {
    setFileList([file]); 
    setImageUrl(URL.createObjectURL(file)); 
  };
  
  const handleAddFood = async (values) => {
    try {
      if (!isValidFoodData(values)) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
      }
  
      const imageFile = values.image?.fileList?.[0]?.originFileObj || values.image?.file;
      if (!imageFile) {
        alert("Vui lòng chọn ảnh hợp lệ!");
        return;
      }
      const payload = {
        idCategory: values.category,
        name: values.name,
        price: parseFloat(values.price),
        file: imageFile,
      };
      
      await addProduct(payload);
      
  
      message.success("✅ Thêm món ăn thành công!");
      setIsModalVisible(false);
      foodForm.resetFields();
      fetchProducts(); // reload lại danh sách
    } catch (error) {
      console.error("❌ Lỗi khi thêm món ăn:", error.response?.data || error.message);
      message.error("❌ Thêm món ăn thất bại!");
    }
  };
  
  // Hàm kiểm tra tính hợp lệ của dữ liệu
  const isValidFoodData = (values) => {
    if (!values.category || !values.name || !values.price) {
      console.error("Thiếu thông tin bắt buộc:", values);
      return false;
    }
  
    if (isNaN(parseFloat(values.price)) || parseFloat(values.price) <= 0) {
      console.error("Giá không hợp lệ:", values.price);
      return false;
    }
  
    return true;
  };

 // thêm danh mục
 const handleAddCategory = async () => {
  try {
    const values = await categoryForm.validateFields();
    setLoading(true);

    await addCategory(values.name, values.discount); // Gửi API thêm danh mục

    message.success("✅ Thêm danh mục thành công!");
    categoryForm.resetFields();
    setIsCategoryModalVisible(false);

    await fetchCategories(); // Load lại danh mục sau khi thêm
  } catch (error) {
    console.error("❌ Thêm danh mục thất bại:", error);
    message.error("❌ Thêm danh mục thất bại!");
  } finally {
    setLoading(false);
  }
};

  // edit product
  const handleEdit = (record) => {
    if (!record.id) {
      message.error("Không tìm thấy ID sản phẩm!");
      return;
    }
  
    setEditingFood(record);
    setImageUrl(record.image);
    setFileList([]);
    setIsEditModalVisible(true);
  
    // Đợi modal mở và categories load xong rồi mới set giá trị
    setTimeout(() => {
      form.setFieldsValue({
        name: record.name,
        price: record.price,
        category: record.categoryModel?.id || record.idCategory,
      });
    }, 100);
  };
  
  const handleUpdateProduct = async () => {
    try {
      const values = await form.validateFields();
  
      if (!editingFood?.id) {
        message.error("Không có sản phẩm để cập nhật!");
        return;
      }
  
      const file = fileList.length > 0 ? fileList[0].originFileObj : null;
  
      console.log("🟡 Dữ liệu gửi đi:", {
        idProduct: editingFood.id,
        idCategory: values.category,
        name: values.name,
        price: values.price,
        file,
      });
  
      await updateProduct(
        editingFood.id,
        values.category,
        values.name,
        values.price,
        file
      );
  
      message.success("✅ Cập nhật thành công!");
      setIsEditModalVisible(false);
      form.resetFields();
      await fetchProducts();
    } catch (error) {
      console.error("❌ Lỗi cập nhật sản phẩm:", error);
      message.error("❌ Cập nhật thất bại!");
    }
  };
  
  // edit danh muc
  const handleEditCategory = (category) => {
    console.log("🛠️ Chỉnh sửa danh mục:", category);
    setEditingCategory(category);
    categoryForm.setFieldsValue({
      name: category.name,
      discount: category.sale, // dùng 'sale' thay vì 'discount' nếu data là từ backend
    });
    setIsEditCategoryModalVisible(true);
  };

  // chỉnh trạng thái đơn hàng
  const handleToggleProductStatus = async (productId) => {
    try {
      await changeProductStatus(productId);
      message.success("✅ Đã thay đổi trạng thái sản phẩm!");
      fetchProducts(); // refresh lại danh sách
    } catch (error) {
      console.error("❌ Lỗi thay đổi trạng thái:", error);
      message.error("❌ Không thể thay đổi trạng thái sản phẩm!");
    }
  };

  // chỉnh trạng thái danh mục 
  const handleToggleCategoryStatus = async (id) => {
    try {
      setLoading(true);
      const updatedList = await toggleCategoryStatus(id);
      setCategories(
        updatedList.map((item) => ({
          id: item.id,
          name: item.category,
          sale: item.sale,
          status: item.status,
        }))
      );
      message.success("✅ Cập nhật trạng thái danh mục thành công!");
    } catch (error) {
      message.error("❌ Lỗi khi cập nhật trạng thái danh mục");
    } finally {
      setLoading(false);
    }
  };
  

  // xem bình luận
  const handleOpenComments = (food) => {
    setSelectedFood(food);
    setComments(food.comments || []);
    setCommentsOpen(true);
  }

  const handleCloseComments = () => {
    setCommentsOpen(false);
    setSelectedFood(null);
    setReply("");
  }

  const handleReplyChange = (event) => {
    setReply(event.target.value);
  }

  const handleSendReply = () => {
    console.log("Reply to", selectedFood.name, ":", reply);
    setReply("");
    handleCloseComments();
  }

  // lưu danh mục
  const handleSaveCategory = async () => {
    try {
      const values = await categoryForm.validateFields();
  
      if (!editingCategory?.id) {
        message.error("Không tìm thấy danh mục cần cập nhật!");
        return;
      }
  
      await updateCategory(editingCategory.id, values.name, values.discount);
  
      message.success("✅ Cập nhật danh mục thành công!");
      setIsEditCategoryModalVisible(false);
      await fetchCategories(); // reload danh sách danh mục
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật danh mục:", error);
      message.error("❌ Cập nhật danh mục thất bại!");
    }
  };
  

  
  
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN").format(value * 1000) + " VND";

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (src) => <Image width={150} src={src} alt="product" />,
    },
    {
      title: "Thông tin",
      dataIndex: "info",
      key: "info",
      render: (_, record) => (
        <div>
          <p><b>Danh Mục:</b> {record.category || "Không rõ"}</p>
          <p><b>Tên Món:</b> {record.name}</p>
          <p><b>Giá gốc:</b> {formatCurrency(record.price)}</p>
          <p><b>Giảm Giá:</b> {record.sale > 0 ? `${record.sale}%` : "Không"}</p>
        </div>
      ),
    },
    {
      title: "Số lượng đã bán",
      dataIndex: "sold",
      key: "sold",
      align: "center",
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      align: "center",
      render: (value) => <span>{formatCurrency(value)}</span>,
    },
    {
      title: "Xem bình luận",
      key: "comment",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<MessageOutlined />}
          onClick={() => {
            setCommentsOpen(true);
            setSelectedFood(record);
          }}
        >
          View
        </Button>
      ),
    },
    {
      title: "Tuỳ chỉnh",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 10 }}
          />
          <Button
            icon={record.status === 0 ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            onClick={() => handleToggleProductStatus(record.id)}
            title={record.status === 0 ? "Ẩn sản phẩm" : "Hiện sản phẩm"}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
        Món Ăn
      </Button>
      <Button type="primary" icon={<PlusOutlined />} style={{ marginLeft: 10 }} onClick={() => setIsCategoryModalVisible(true)}>
        Danh Mục
      </Button>

      {/* Ô tìm kiếm */}
      <Search
        placeholder="Tìm kiếm theo tên hoặc danh mục"
        enterButton={<SearchOutlined />}
        style={{ width: 400, marginLeft: 20 }}
        onChange={(e) => setSearchText(e.target.value)} // Cập nhật searchText khi nhập
      />
      <Table
        columns={columns}
        style={{ marginTop: 25 }}
        dataSource={filteredData.map((item) => ({
          id: item.id,
          image: BASE_URL_IMAGE + item.image,
          category: item.category,
          name: item.name,
          price: item.price,
          sale: item.sale, 
          sold: item.sold,
          revenue: item.revenue,
          status: item.status,
        }))}
        
        loading={loading}
        pagination={{ pageSize: 4 }}
      />

      {/* Modal Thêm Món Ăn */}
      <Modal title="Thêm Món" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
      <Form
        form={foodForm}
        layout="vertical"
        onFinish={handleAddFood} // không cần thêm file nữa
      >

        
        {/* Upload hình ảnh */}
        <Form.Item label="Hình ảnh" name="image" rules={[{ required: true, message: "Vui lòng chọn ảnh!" }]}>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false} // Không tự động upload lên server
            showUploadList={false} // Ẩn danh sách file (có thể bỏ nếu muốn kiểm tra)
          >
            {imageUrl ? <img src={imageUrl} alt="food" style={{ width: "100px", height: "100px" }} /> : <PlusOutlined />}
          </Upload>
        </Form.Item>


        {/* Nhập tên món */}
        <Form.Item label="Tên món" name="name" rules={[{ required: true, message: "Vui lòng nhập tên món!" }]}>
          <Input />
        </Form.Item>

        {/* Nhập giá món */}
        <Form.Item label="Giá gốc" name="price" rules={[
          { required: true, message: "Vui lòng nhập giá!" },
          { pattern: /^[1-9]\d*$/, message: "Giá phải là số dương!" }
        ]}>
          <Input
            placeholder="Nhập giá món ăn"
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, ""); 
              foodForm.setFieldsValue({ price: value });
            }}
          />
        </Form.Item>

        {/* Chọn danh mục món */}
          <Form.Item
            label="Danh mục món"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
          <Select placeholder="Chọn danh mục">
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>

        </Form.Item>


        {/* Nút Thêm */}
        <Button type="primary" htmlType="submit" loading={loading}>
          Thêm
        </Button>

      </Form>
      </Modal>

      {/* Modal Thêm Danh Mục */}
      <Modal
        title="Thêm Danh Mục"
        open={isCategoryModalVisible}
        onCancel={() => setIsCategoryModalVisible(false)}
        footer={null}
      >
        {/* Danh sách danh mục */}
        <Table
          loading={loading}
          rowKey="id"
          dataSource={categories}
          pagination={{ pageSize: 3 }}
          style={{ marginTop: 20 }}
          columns={[
            {
              title: "Tên danh mục",
              dataIndex: "name",
              key: "name",
            },
            {
              title: "Hành động",
              key: "actions",
              render: (_, record) => (
                <div>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => handleEditCategory(record)}
                    style={{ marginRight: 10 }}
                  />
                  <Button
                    icon={record.status === 0 ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    onClick={() => handleToggleCategoryStatus(record.id)}
                  />
                </div>
              ),
            },
          ]}
        />
        {/* Form thêm danh mục */}
        <Form layout="vertical" form={categoryForm} onFinish={handleAddCategory}>
          <Form.Item
            label="Loại danh mục món"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giảm giá (%)"
            name="discount"
            rules={[
              { required: true, message: "Vui lòng nhập giảm giá!" },
              { pattern: /^(100|[1-9]?[0-9])$/, message: "Nhập số từ 0 - 100!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm
          </Button>
        </Form>
      </Modal>

      {/* Modal Chỉnh Sửa Món Ăn */}
      <Modal
        title="Chỉnh sửa món ăn"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Hình ảnh">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} 
              showUploadList={false} 
            >
              {imageUrl ? (
                <img src={imageUrl} alt="food" style={{ width: "100%", height: "100px", objectFit: "cover" }} />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item label="Tên món" name="name" rules={[{ required: true, message: "Vui lòng nhập tên món!" }]}>
            <Input />
          </Form.Item>
          
          <Form.Item label="Giá gốc" name="price" rules={[{ required: true, message: "Vui lòng nhập giá!" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Danh mục món" name="category" rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}>
            <Select placeholder="Chọn danh mục">
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>


          <Button type="primary" onClick={handleUpdateProduct}>Cập nhật</Button>
        </Form>
      </Modal>

       {/* Modal Chỉnh Sửa Danh Mục */}
       <Modal
        title="Chỉnh sửa danh mục"
        open={isEditCategoryModalVisible}
        onCancel={() => setIsEditCategoryModalVisible(false)}
        onOk={handleSaveCategory}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={categoryForm} layout="vertical">
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giảm giá (%)"
            name="discount"
            rules={[
              { required: true, message: "Vui lòng nhập giảm giá" },
              { type: "number", min: 0, max: 100, message: "Nhập từ 0 - 100" },
            ]}
          >
          <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* modal bình luận */}
      <Modal
        title={`Bình luận cho ${selectedFood?.name}`}
        visible={commentsOpen}
        onCancel={handleCloseComments}
        onOk={handleSendReply}
        okText="Gửi"
        cancelText="Đóng"
      >
        <List
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={(comment, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                avatar={<Avatar src={comment.image} />}
                title={comment.user}
                description={comment.text}
              />
            </List.Item>
          )}
        />
        <Input.TextArea
          rows={3}
          placeholder="Trả lời bình luận"
          value={reply}
          onChange={handleReplyChange}
        />
        <Upload>
          <Button icon={<UploadOutlined />} style={{ marginTop: 10 }}>Image</Button>
        </Upload>
        <Button icon={<SmileOutlined />} style={{ marginTop: 10 }}>Icon</Button>
      </Modal>

    </div>
  );
};

export default Food;
