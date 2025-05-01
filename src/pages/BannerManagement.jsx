import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Upload, Image, message, Row, Col } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllBanners, searchBanners, addBanner, updateBanner, deleteBanner } from "../api/Banner";
import { BASE_URL_IMAGE } from "../api/configs";

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const fetchBanners = async () => {
    try {
      const data = await getAllBanners();
      setBanners(data);
      setFilteredBanners(data);
    } catch (error) {
      message.error("Không thể tải danh sách banner");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (selectedBanner && isEditModalOpen) {
      form.setFieldsValue({
        text: selectedBanner.text,
      });
    }
  }, [selectedBanner, isEditModalOpen, form]);

  const handleSearch = async (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    try {
      if (value.trim() === "") {
        setFilteredBanners(banners);
      } else {
        const result = await searchBanners(value);
        setFilteredBanners(result);
      }
    } catch (error) {
      message.error("Lỗi khi tìm kiếm banner");
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Chỉ chấp nhận ảnh định dạng JPG hoặc PNG!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải có kích thước nhỏ hơn 2MB!");
      return false;
    }
    return isJpgOrPng && isLt2M;
  };

  const handleAdd = async (values) => {
    try {
      const file = values.image.file.originFileObj;
      const text = values.text;

      await addBanner(file, text);

      message.success("Thêm banner thành công!");
      setIsModalOpen(false);
      form.resetFields();
      fetchBanners();
    } catch (error) {
      message.error("Không thể thêm banner");
    }
  };

  const handleEdit = async (values) => {
    try {
      const text = values.text;
      const file = fileList.length > 0 ? fileList[0].originFileObj : null;

      await updateBanner(selectedBanner.id, file, text);

      message.success("Cập nhật banner thành công!");
      setIsEditModalOpen(false);
      setFileList([]);
      fetchBanners();
    } catch (error) {
      message.error("Không thể cập nhật banner");
    }
  };

  return (
    <div style={{ padding: 20, backgroundColor: "#1e1e2e", color: "white", borderRadius: 10 }}>
      <h2 style={{ color: "white", fontWeight: "bold" }}>BANNER</h2>

      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Tìm kiếm banner..."
            onChange={handleSearch}
            value={searchText}
            suffix={<SearchOutlined />}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} sm={12} md={4} style={{ textAlign: "right", marginTop: 8 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Thêm
          </Button>
        </Col>
      </Row>

      <Table
        columns={[
          {
            title: "Banner",
            dataIndex: "image",
            key: "image",
            render: (src) => <Image width={150} src={`${BASE_URL_IMAGE}${src}`} />,
          },
          {
            title: "Quảng cáo",
            dataIndex: "text",
            key: "text",
          },
          {
            title: "Tùy chỉnh",
            key: "actions",
            render: (_, record) => (
              <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedBanner(record);
                    setIsEditModalOpen(true);
                  }}
                />
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={async () => {
                    try {
                      await deleteBanner(record.id);
                      message.success("Đã xoá banner!");
                      fetchBanners();
                    } catch (error) {
                      message.error("Xoá banner thất bại!");
                    }
                  }}
                />
              </div>
            ),
          },
        ]}
        dataSource={filteredBanners}
        rowKey="id"
        pagination={{ pageSize: 4 }}
        bordered
        scroll={{ x: 768 }}
      />

      <Modal
        title="Thêm Banner"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item label="Chọn Ảnh" name="image" rules={[{ required: true, message: "Vui lòng chọn ảnh!" }]}>
            <Upload
              beforeUpload={beforeUpload}
              listType="picture"
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Nội dung quảng cáo" name="text" rules={[{ required: true, message: "Nhập nội dung!" }, { max: 255, message: "Tối đa 255 ký tự!" }]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh Sửa Banner"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          form.resetFields();
          setFileList([]);
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleEdit} layout="vertical">
          {selectedBanner && <Image width={200} src={`${BASE_URL_IMAGE}${selectedBanner.image}`} />}
          <Form.Item label="Thay đổi ảnh" name="image">
            <Upload
              beforeUpload={beforeUpload}
              listType="picture"
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Nội dung quảng cáo" name="text" rules={[{ required: true, message: "Nhập nội dung!" }, { max: 255, message: "Tối đa 255 ký tự!" }]}>
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BannerManagement;